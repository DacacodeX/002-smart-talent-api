const admin = require('../config/firebase-admin');

const UploadController = {
  getSignedUrl: async (req, res) => {
    try {
      const { fileName, contentType } = req.body;
      
      if (!fileName || !contentType) {
        return res.status(400).json({
          message: 'Nombre del archivo y tipo de contenido son requeridos'
        });
      }

      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);

      // Generar URL firmada para subida
      const [signedUrl] = await file.generateSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // URL válida por 15 minutos
        contentType: contentType
      });

      res.json({
        message: 'URL firmada generada exitosamente',
        signedUrl,
        fileName
      });

    } catch (error) {
      console.error('Error al generar URL firmada:', error);
      res.status(500).json({
        message: 'Error al generar URL firmada',
        error: error.message
      });
    }
  }
};

module.exports = { UploadController };