const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Holding = require('../models/Holding');

// GET all holdings
router.get('/', auth, async (req, res) => {
    try {
        const holdings = await Holding.find({ user: req.user.id });
        res.json(holdings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST create holding
router.post('/', auth, async (req, res) => {
    try {
        const holding = new Holding({ ...req.body, user: req.user.id });
        await holding.save();
        res.json(holding);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE holding
router.delete('/:id', auth, async (req, res) => {
    try {
        let holding = await Holding.findById(req.params.id);
        if (!holding) return res.status(404).json({ msg: 'Holding not found' });
        if (holding.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        await Holding.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Holding removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
