const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const request = require('supertest');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.init();
    
    // Register
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test12@test.com', password: 'password123' });
      
    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'test12@test.com', password: 'password123' })
      .expect(200);
      
    const cookies = loginRes.headers['set-cookie'];
    console.log('Login cookies:', cookies ? 'received' : 'missing');
    
    // Get Me
    const meRes = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', cookies)
      .expect(200);
      
    console.log('Me response:', meRes.body);
    console.log('SUCCESS!');
    
    await app.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
bootstrap();
