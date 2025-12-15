// In-memory fake database
let users = [];
let contentItems = [];
let userIdCounter = 1;
let contentIdCounter = 1;

const store = {
  // User operations
  findUserByEmail(email) {
    return users.find(u => u.email === email);
  },
  
  findUserById(id) {
    return users.find(u => u._id === id);
  },
  
  createUser(email, passwordHash, name) {
    const user = {
      _id: userIdCounter++,
      email,
      passwordHash,
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(user);
    return user;
  },

  // Content operations
  findContentById(id) {
    return contentItems.find(c => c._id === id);
  },

  findContentByUserIdAndId(userId, id) {
    return contentItems.find(c => c._id === id && c.userId === userId);
  },

  findContentByUserId(userId, limit = 200) {
    return contentItems
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  createContent(userId, title, content_text, type, source, metadata = {}) {
    const item = {
      _id: contentIdCounter++,
      userId,
      title,
      content_text,
      type,
      source,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    contentItems.push(item);
    return item;
  },

  deleteContent(id, userId) {
    const idx = contentItems.findIndex(c => c._id === id && c.userId === userId);
    if (idx === -1) return null;
    const [deleted] = contentItems.splice(idx, 1);
    return deleted;
  },

  searchContent(userId, query, fromDate, toDate) {
    let results = contentItems.filter(c => c.userId === userId);

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(c =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.content_text && c.content_text.toLowerCase().includes(q))
      );
    }

    if (fromDate) {
      const from = new Date(fromDate);
      results = results.filter(c => new Date(c.createdAt) >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      results = results.filter(c => new Date(c.createdAt) <= to);
    }

    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

module.exports = store;
