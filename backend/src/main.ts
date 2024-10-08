import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api') // set global prefix
  app.enableCors() // enable CORS
  await app.listen(6015)
}
bootstrap()
