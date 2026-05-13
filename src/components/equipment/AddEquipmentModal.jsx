"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AddEquipmentModal() {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Ventilator",
    roomNumber: "",
    status: "Available",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/addequipment", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast("Equipment Added Successfully");

        setIsOpen(false);

        setFormData({
          name: "",
          category: "Ventilator",
          roomNumber: "",
          status: "Available",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          bg-zinc-100
          hover:bg-zinc-200
          text-black
          px-4 py-2
          rounded-xl
          text-sm font-medium
          transition-all
        "
      >
        + Equipment
      </button>

      {/* MODAL */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/40
            p-4
          "
        >
          {/* BOX */}
          <div
            className="
              w-full max-w-xl
              bg-white
              rounded-2xl
              border border-zinc-200
              p-6
            "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-black">
                  Add Equipment
                </h1>

                <p className="text-sm text-zinc-500 mt-1">
                  Register emergency room equipment
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="
                  text-2xl
                  text-zinc-500
                "
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="
                grid grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >
              {/* EQUIPMENT NAME */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Equipment Name</label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                />
              </div>

              {/* CATEGORY */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Category</label>

                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                >
                  <option value="Ventilator">Ventilator</option>

                  <option value="ECG">ECG</option>

                  <option value="Wheelchair">Wheelchair</option>

                  <option value="Monitor">Monitor</option>

                  <option value="Infusion Pump">Infusion Pump</option>

                  <option value="Oxygen Cylinder">Oxygen Cylinder</option>
                </select>
              </div>

              {/* ROOM NUMBER */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Room Number</label>

                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roomNumber: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                />
              </div>

              {/* STATUS */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Status</label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                >
                  <option value="Available">Available</option>

                  <option value="In Use">In Use</option>

                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="
                    border border-zinc-300
                    px-4 py-2
                    rounded-xl
                    text-black
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    bg-black text-white
                    px-5 py-2
                    rounded-xl
                  "
                >
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
