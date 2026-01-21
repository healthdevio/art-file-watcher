const fs = require('fs');
const path = require('path');

// Importar usando require (CommonJS)
const { ReadRetFileService } = require('../dist/services/read-ret-file');

function findCNBFiles(dir) {
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findCNBFiles(fullPath));
      } else {
        const ext = entry.name.toLowerCase();
        if (ext.endsWith('.ret') || ext.endsWith('.a2t9r5') || ext.endsWith('.a2u7f4') || 
            ext.endsWith('.a2u1w8') || ext.endsWith('.a2u5m7')) {
          files.push(fullPath);
        }
      }
    }
  } catch (e) {}
  return files;
}

async function testFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const service = new ReadRetFileService();
    // Passar como Buffer para evitar que seja tratado como caminho de arquivo
    const result = await service.read(Buffer.from(content, 'utf-8'));
    
    if (!result.success || !result.cnabType.startsWith('CNAB240')) {
      return { file: path.basename(filePath), error: result.error || 'Não é CNAB 240' };
    }
    
    const segmentULines = result.data.lines.filter(l => 
      l.payload && l.payload.segmentType === 'U'
    );
    
    return {
      file: path.basename(filePath),
      segmentUCount: segmentULines.length,
      samples: segmentULines.slice(0, 2).map(l => ({
        paymentDate: l.payload.paymentDate,
        creditDate: l.payload.creditDate,
        paidAmount: l.payload.paidAmount,
        receivedValue: l.payload.receivedValue,
      }))
    };
  } catch (error) {
    return { file: path.basename(filePath), error: error.message };
  }
}

async function runTests() {
  console.log('=== TESTE DE DETECÇÃO AUTOMÁTICA DE LAYOUT ===\n');
  
  const auditDir = path.resolve(__dirname, '../volumes/audit/2025-12');
  const files = findCNBFiles(auditDir).slice(0, 20); // Testar primeiros 20 arquivos
  
  console.log(`Testando ${files.length} arquivos...\n`);
  
  const results = [];
  let totalSegmentU = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const result = await testFile(file);
    if (result) {
      if (result.error) {
        errorCount++;
        console.log(`❌ ${result.file}: ${result.error}`);
      } else {
        successCount++;
        totalSegmentU += result.segmentUCount;
        console.log(`✓ ${result.file}: ${result.segmentUCount} Segmento(s) U`);
        if (result.samples.length > 0) {
          const sample = result.samples[0];
          console.log(`  paymentDate: ${sample.paymentDate}, creditDate: ${sample.creditDate}`);
          console.log(`  paidAmount: ${sample.paidAmount}, receivedValue: ${sample.receivedValue}`);
        }
        results.push(result);
      }
    }
  }
  
  console.log('\n=== RESUMO ===\n');
  console.log(`Arquivos processados com sucesso: ${successCount}`);
  console.log(`Arquivos com erro: ${errorCount}`);
  console.log(`Total de Segmentos U encontrados: ${totalSegmentU}`);
  
  // Verificar se as datas estão sendo extraídas corretamente
  const validDates = results.reduce((acc, r) => {
    r.samples.forEach(s => {
      if (s.paymentDate && s.paymentDate !== '' && !s.paymentDate.includes('00/00')) acc++;
      if (s.creditDate && s.creditDate !== '' && !s.creditDate.includes('00/00')) acc++;
    });
    return acc;
  }, 0);
  
  console.log(`\nDatas válidas extraídas: ${validDates}`);
  console.log(`✅ Teste concluído!`);
}

runTests().catch(console.error);
