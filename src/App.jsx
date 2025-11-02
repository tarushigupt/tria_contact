import React, { useState, useMemo } from "react";
import "./App.css";

export default function App() {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Aisha Kapoor", phone: "9876543210", email: "aisha@example.com" },
    { id: 2, name: "Rohit Sharma", phone: "9123456789", email: "rohit@example.com" },
    { id: 3, name: "Maya Rao", phone: "9987654321", email: "maya@example.com" },
  ]);

  const [search, setSearch] = useState("");
  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [bin, setBin] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", phone: "", email: "" });

  const filteredContacts = useMemo(() => {
    return contacts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search)
      )
      .sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
  }, [contacts, search, sortAsc]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newContact.name.trim()) return alert("Please enter a name");
    if (!/^\d{10}$/.test(newContact.phone)) {
      alert("Phone number must contain exactly 10 digits!");
      return;
    }
    const duplicate = contacts.some(
      (c) =>
        c.name.toLowerCase() === newContact.name.toLowerCase() ||
        c.phone === newContact.phone
    );
    if (duplicate) {
      alert("Contact with same name or phone already exists!");
      return;
    }

    setContacts([...contacts, { ...newContact, id: Date.now() }]);
    setNewContact({ name: "", phone: "", email: "" });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    const toDelete = contacts.find((c) => c.id === id);
    setBin([...bin, toDelete]);
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setEditData({ name: contact.name, phone: contact.phone, email: contact.email });
  };

  const handleSaveEdit = (id) => {
    if (!editData.name.trim()) return alert("Please enter a name");
    if (!/^\d{10}$/.test(editData.phone)) {
      alert("Phone number must contain exactly 10 digits!");
      return;
    }
    const duplicate = contacts.some(
      (c) =>
        (c.name.toLowerCase() === editData.name.toLowerCase() ||
          c.phone === editData.phone) &&
        c.id !== id
    );
    if (duplicate) {
      alert("Contact with same name or phone already exists!");
      return;
    }

    const updatedContacts = contacts.map((c) =>
      c.id === id ? { ...c, ...editData } : c
    );
    setContacts(updatedContacts);
    setEditingId(null);
  };

  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="app">
      
      <div className="topbar">
        <h1>
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="contact icon"
            className="logo-icon"
          />
          Tria Contact List
        </h1>

        <div className="search-container">
          <img
            src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
            alt="search"
            className="search-icon"
          />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setSortAsc(!sortAsc)}>
            Sort {sortAsc ? "↓" : "↑"}
          </button>
        </div>

        <div className="top-buttons">
          <button onClick={() => setShowAddForm(!showAddForm)}>+ Add</button>
          <button onClick={() => alert(`Bin contains ${bin.length} contact(s).`)}>
            Bin
          </button>
        </div>
      </div>

      
      {showAddForm && (
        <form onSubmit={handleAdd} className="add-form">
          <input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          />
          <button type="submit">Add Contact</button>
        </form>
      )}

      
      <div className="contact-list">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <div className="avatar">{initials(contact.name)}</div>

              <div className="info">
                {editingId === contact.id ? (
                  <>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                    />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                    />
                    <button
                      className="save-btn"
                      onClick={() => handleSaveEdit(contact.id)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <strong>{contact.name}</strong>
                    <br />
                    <span>{contact.phone}</span>
                    <br />
                    <span>{contact.email}</span>
                  </>
                )}
              </div>

              {editingId !== contact.id && (
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(contact)}
                >
                  Change
                </button>
              )}

              <button
                className="delete-btn"
                onClick={() => handleDelete(contact.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="empty">No contacts found.</p>
        )}
      </div>
    </div>
  );
}
