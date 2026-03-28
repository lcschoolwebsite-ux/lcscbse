import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import healthRoutes from './routes/health.routes.js';
import newsRoutes from './routes/news.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import managementRoutes from './routes/management.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import contactRoutes from './routes/contact.routes.js';
import testimonialsRoutes from './routes/testimonials.routes.js';
import contentRoutes from './routes/content.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import enquiriesRoutes from './routes/enquiries.routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '../../frontend');

app.use(
  cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',').map((item) => item.trim())
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api', (req, res) => {
  res.json({ ok: true, message: 'Loretto backend is running' });
});

app.use('/api/health', healthRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/management', managementRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', contentRoutes);

app.use(express.static(frontendDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

export default app;
