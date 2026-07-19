import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, MessageSquare, Star } from 'lucide-react';
import axios from 'axios';
import { userByRole } from "../services/authService.js";
import Select from 'react-select';
import { getTestimonials } from "../services/testimonialService.js";

export const AdminPatronTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [users,setUsers]=useState([]);

  
  useEffect(() => {
  const fetchUser = async () => {
    try {
       const response = await userByRole();
      
      setUsers(response.data.data);
    } catch (error) {
      
    }
  };

  fetchUser();
}, []);

//  fetchTestimonials
    useEffect(() => {
      const fetchTestimonials = async () => {
        try {
          const response = await getTestimonials();
          console.log(response.data.data);

          setTestimonials(response.data.data);

        } catch (error) {
          console.log(error);
        }
      };

      fetchTestimonials();
    }, []);

  const resetForm = () => {
    setName('');
    setRole('');
    setMessage('');
    setRating(5);
    setEditingId(null);
  };

  // CREATE + UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name,
                role,
                message,
                rating,
              }
            : item,
        ),
      );
    } else {
      setTestimonials([
        ...testimonials,
        {
          id: Date.now(),
          name,
          role,
          message,
          rating,
          status: true,
        },
      ]);
    }

    resetForm();
  };

  // EDIT
  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setRole(item.role);
    setMessage(item.message);
    setRating(item.rating);
  };

  // DELETE
  const handleDelete = (id) => {
    setTestimonials(testimonials.filter((item) => item.id !== id));
    
  };

  // STATUS TOGGLE
  const toggleStatus = (id) => {
    setTestimonials((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: !item.status,
            }
          : item,
      ),
    );
  };

  const patronOptions = users.map((user) => ({
  value: user.firstName,
  label: user.firstName,
}));

  return (
    <div className="space-y-8 max-w-5xl">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-stone-200 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Patron Testimonials Management</h1>

          <p className="text-xs text-stone-400">Manage customer testimonials displayed on website.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT FORM */}

        <div className="lg:col-span-4 bg-white dark:bg-stone-900 border border-stone-200 p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <Plus className="text-yellow-600" />

            <h3 className="font-bold">{editingId ? 'Edit' : 'Create'} Testimonial</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
                <Select options={patronOptions}
                value={patronOptions.find((option) => option.value === name) || null}
                onChange={(selected) => setName(selected?.value || '')} placeholder="Search Patron Name" isSearchable />

            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" rows="4" className="w-full text-xs px-3 py-3 border rounded-xl" />

            <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full text-xs px-3 py-3 border rounded-xl" />

            <button className="w-full bg-yellow-500 py-3 rounded-xl font-bold text-xs uppercase">{editingId ? 'Update' : 'Add'} Testimonial</button>
          </form>
        </div>

        {/* RIGHT LIST */}

        <div className="lg:col-span-8 bg-white dark:bg-stone-900 border p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <MessageSquare className="text-yellow-600" />

            <h3 className="font-bold">Testimonials ({testimonials.length})</h3>
          </div>
          <div className="divide-y">
            {testimonials.map((item) => (
              <div key={item.id} className="py-5 flex justify-between gap-4">
                <div>
                  <h4 className="font-bold text-stone-900">{item.user.firstName}</h4>

                  <p className="text-xs text-yellow-700 font-semibold">{item.user.addresses}</p>

                  <p className="text-xs text-stone-400 mt-2">{item.message}</p>

                  <div className="flex mt-2">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={15} fill="orange" className="text-orange-400" />
                    ))}
                  </div>

                  <span className="text-[10px]">{item.status ? 'Active / Visible' : 'Disabled / Hidden'}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(item.id)} className="p-2">
                    {item.status ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>

                  <button onClick={() => handleEdit(item)} className="p-2">
                    <Edit2 size={15} />
                  </button>

                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
