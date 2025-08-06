import { generate } from 'openapi-typescript-codegen';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const swaggerUrl = process.env.API_DOC_URL;

if (!swaggerUrl) {
  console.error("❌ Variável API_DOC_URL não definida no .env");
  process.exit(1);
}

generate({
  input: swaggerUrl,
  output: 'src/api',
  clientName: 'MensuraApiClient',
}).then(() => {
  console.log('✅ API client gerado com sucesso!');
});
