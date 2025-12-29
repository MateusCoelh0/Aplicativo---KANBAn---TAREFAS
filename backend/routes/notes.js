import express from 'express';
import Note from '../models/Note.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Listar todas as notas do usuário
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar notas',
      error: error.message,
    });
  }
});

// Obter uma nota específica
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Nota não encontrada',
      });
    }

    // Verificar se a nota pertence ao usuário
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter nota',
      error: error.message,
    });
  }
});

// Criar nova nota
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Título é obrigatório',
      });
    }

    const newNote = new Note({
      userId: req.userId,
      title,
      content,
    });

    await newNote.save();

    res.status(201).json({
      success: true,
      data: newNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar nota',
      error: error.message,
    });
  }
});

// Atualizar nota
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Nota não encontrada',
      });
    }

    // Verificar se a nota pertence ao usuário
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    const { title, content } = req.body;

    if (title) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar nota',
      error: error.message,
    });
  }
});

// Deletar nota
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Nota não encontrada',
      });
    }

    // Verificar se a nota pertence ao usuário
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Nota deletada com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar nota',
      error: error.message,
    });
  }
});

export default router;
