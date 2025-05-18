const express = require('express');
const router = express.Router();
const { RequestController } = require('../controllers/request.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Crear una nueva solicitud con personas, documentos y recursos
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityId
 *               - people
 *             properties:
 *               entityId:
 *                 type: integer
 *                 description: ID de la entidad que realiza la solicitud
 *               people:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - firstName
 *                     - lastName
 *                     - documentNumber
 *                     - documents
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       description: Nombre de la persona
 *                     lastName:
 *                       type: string
 *                       description: Apellido de la persona
 *                     documentNumber:
 *                       type: string
 *                       description: Número de documento de la persona
 *                     documents:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - type
 *                           - number
 *                           - resources
 *                         properties:
 *                           type:
 *                             type: string
 *                             description: Tipo de documento
 *                             enum: ['DNI', 'PASSPORT', 'LICENSE']
 *                           number:
 *                             type: string
 *                             description: Número del documento
 *                           resources:
 *                             type: array
 *                             items:
 *                               type: object
 *                               required:
 *                                 - type
 *                                 - url
 *                               properties:
 *                                 type:
 *                                   type: string
 *                                   description: Tipo de recurso
 *                                   enum: ['SCAN', 'PHOTO', 'PDF']
 *                                 url:
 *                                   type: string
 *                                   description: URL del recurso
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitud creada exitosamente"
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     entityId:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     people:
 *                       type: array
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.post('/', [
  authMiddleware,
  roleMiddleware(['ADMIN', 'USER'])
], RequestController.create);

/**
 * @swagger
 * /api/requests/entity/{entityId}/persons:
 *   get:
 *     summary: Obtener todas las personas de una entidad específica
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de personas obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Entidad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/entity/:entityId/persons', [
  authMiddleware,
  roleMiddleware(['ADMIN', 'MANAGER'])
], RequestController.getAllPersonsByEntityId);

/**
 * @swagger
 * /api/requests/people:
 *   get:
 *     summary: Obtener todas las personas con su entidad asociada
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de personas obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/people', [
  authMiddleware,
  roleMiddleware(['ADMIN', 'MANAGER'])
], RequestController.getAllPeople);

module.exports = { requestRoutes: router };