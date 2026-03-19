"use client"; 
import { useEffect, useState } from "react";

export default function Home() {
  const [bugs, setBugs] = useState([]); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [showClosed, setShowClosed] = useState(false); // For the tray toggle

  useEffect(() => {
    fetch("http://localhost:5000/bugs")
      .then((response) => response.json())
      .then((data) => setBugs(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBug = { title, description, priority };
    const response = await fetch("http://localhost:5000/bugs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBug),
    });
    if (response.ok) {
      const savedBug = await response.json();
      setBugs([savedBug, ...bugs]);
      setTitle(""); setDescription(""); setPriority("Low");
    }
  };

  // --- NEW: Function to close a bug ---
  const handleCloseBug = async (id) => {
  try {
      const response = await fetch(`http://localhost:5000/bugs/${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Closed" }),
      });

      // Check if the server actually sent back a success code (200)
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server shouted at us:", errorData.error);
        return;
      }

      const updatedBug = await response.json();
      setBugs(bugs.map(b => b.id === id ? updatedBug : b));
      
    } catch (err) {
      console.error("The fetch itself failed:", err);
    }
  };
  const handleDeleteBug = async (id) => {
    if (!window.confirm("Are you sure? This will delete the bug forever!")) return;

    try {
      const response = await fetch(`http://localhost:5000/bugs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the bug from your local React state so it disappears instantly
        setBugs(bugs.filter((bug) => bug.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Delete failed:", errorData.error);
      }
    } catch (err) {
      console.error("Network error during delete:", err);
    }
  };

  // Logic to split the list into two categories
  const activeBugs = bugs.filter(b => b.status !== 'Closed');
  const closedBugs = bugs.filter(b => b.status === 'Closed');

  

  return (
    <main className="p-10 bg-gray-50 min-h-screen pb-40">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Bug Tracker</h1>
        
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="space-y-4">
            <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" required className="w-full border p-2 rounded text-gray-900 placeholder:text-gray-400" />
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" required className="w-full border p-2 rounded text-gray-900 placeholder:text-gray-400 h-20" />
            <select value={priority} onChange={(e)=>setPriority(e.target.value)} className="w-full border p-2 rounded text-gray-900">
              <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700">Submit Bug</button>
          </div>
        </form>

        {/* Active Bugs List */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Active Issues ({activeBugs.length})</h2>
        <div className="space-y-4">
          {activeBugs.map((bug) => (
            <div key={bug.id} className="bg-white border p-5 rounded-lg shadow-sm flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{bug.title}</h3>
                  {/* RE-ADDED PRIORITY BADGE */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border 
                    ${bug.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 
                      bug.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                      'bg-green-50 text-green-600 border-green-200'}`}>
                    {bug.priority}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{bug.description}</p>
              </div>
              
              <button 
                onClick={() => handleCloseBug(bug.id)}
                className="ml-4 text-xs font-bold text-gray-400 hover:text-green-600 hover:bg-green-50 border border-gray-200 px-3 py-1.5 rounded-md transition-all whitespace-nowrap"
              >
                ✓ Close
              </button>
            </div>
          ))}
        </div>

        {/* --- THE PRO TRAY (CLOSED BUGS) --- */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-2xl flex flex-col items-center">
          <button 
            onClick={() => setShowClosed(!showClosed)}
            className="bg-gray-800 text-white px-6 py-2 rounded-t-lg text-sm font-bold -mt-10 shadow-lg"
          >
            {showClosed ? "↓ Hide Closed Bugs" : `↑ Show Closed Bugs (${closedBugs.length})`}
          </button>

          {showClosed && (
            <div className="w-full max-w-3xl p-6">
              {/* This is the scrollable "Pro" container */}
              <div className="max-h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {closedBugs.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 italic">No closed bugs yet.</p>
                ) : (
                  closedBugs.map((bug) => {
                    return (
                      <div key={bug.id} className="bg-gray-50 border border-gray-200 p-3 rounded-md flex justify-between items-center opacity-70 group">
                        <div className="flex flex-col">
                          <span className="text-gray-700 line-through font-medium">{bug.title}</span>
                          <span className="text-[10px] text-gray-400">ID: #{bug.id}</span>
                        </div>
                      
                      <button 
                        onClick={() => handleDeleteBug(bug.id)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Forever"
                      >
                        {/* A simple 'X' or Trash icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )})
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
