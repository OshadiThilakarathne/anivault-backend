import LibraryItem from "../models/LibraryItem.js";

// GET /api/library
export const getLibrary = async (req, res) => {
  try {
    const items = await LibraryItem.find({ user: req.user._id }).sort({ addedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/library
export const addItem = async (req, res) => {
  try {
    const { malId, isGroup } = req.body;

    // Prevent duplicate standalone entries
    if (!isGroup) {
      const exists = await LibraryItem.findOne({ user: req.user._id, malId, isGroup: false });
      if (exists) {
        return res.status(400).json({ message: "Anime already in library" });
      }
    }

    const item = await LibraryItem.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/library/:id
export const updateItem = async (req, res) => {
  try {
    const item = await LibraryItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/library/:id
export const deleteItem = async (req, res) => {
  try {
    const item = await LibraryItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Removed from library" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};