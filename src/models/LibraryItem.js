import mongoose from "mongoose";

// Single anime entry shape
const animeEntrySchema = new mongoose.Schema({
  malId:           { type: Number, required: true },
  title:           { type: String, required: true },
  titleEnglish:    { type: String },
  coverImage:      { type: String },
  synopsis:        { type: String },
  genres:          [String],
  episodes:        { type: Number },
  studio:          { type: String },
  year:            { type: Number },
  status:          { type: String, enum: ["watching", "completed", "plan_to_watch", "on_hold", "dropped"], default: "plan_to_watch" },
  userRating:      { type: Number, min: 1, max: 10 },
  review:          { type: String },
  episodeProgress: { type: Number, default: 0 },
  startDate:       { type: String },
  finishDate:      { type: String },
  addedAt:         { type: Date, default: Date.now },
}, { _id: false });

// Group shape
const libraryItemSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    isGroup:    { type: Boolean, default: false },

    // ── Standalone anime fields ──
    malId:           { type: Number },
    title:           { type: String, required: true },
    titleEnglish:    { type: String },
    coverImage:      { type: String },
    synopsis:        { type: String },
    genres:          [String],
    episodes:        { type: Number },
    studio:          { type: String },
    year:            { type: Number },
    status:          { type: String, enum: ["watching", "completed", "plan_to_watch", "on_hold", "dropped"], default: "plan_to_watch" },
    userRating:      { type: Number, min: 1, max: 10 },
    review:          { type: String },
    episodeProgress: { type: Number, default: 0 },
    startDate:       { type: String },
    finishDate:      { type: String },
    addedAt:         { type: Date, default: Date.now },

    // ── Group-only fields ──
    seasons: [animeEntrySchema],
  },
  { timestamps: true }
);

export default mongoose.model("LibraryItem", libraryItemSchema);