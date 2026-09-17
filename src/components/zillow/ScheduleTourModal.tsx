import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  Phone,
  Mail,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Property, TourBooking } from "../../types";
import { useStore } from "../../store/useStore";

interface ScheduleTourModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleTourModal: React.FC<ScheduleTourModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const { addTourBooking } = useStore();

  const [tourType, setTourType] = useState<"in_person" | "video">("in_person");
  
  // Generate 7 days starting today
  const upcomingDays = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const fullDate = d.toISOString().split("T")[0];
    return { dayName, monthDay, fullDate };
  });

  const [selectedDay, setSelectedDay] = useState<string>(upcomingDays[1].fullDate);
  const timeSlots = ["10:00 AM", "11:30 AM", "1:30 PM", "3:00 PM", "4:30 PM", "6:00 PM"];
  const [selectedTime, setSelectedTime] = useState<string>("11:30 AM");

  const [name, setName] = useState("Alex Morgan");
  const [phone, setPhone] = useState("+91 98200 45678");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [notes, setNotes] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<TourBooking | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dayObj = upcomingDays.find((d) => d.fullDate === selectedDay) || upcomingDays[1];
    
    const newBooking = addTourBooking({
      propertyId: property.id,
      propertyTitle: property.title,
      buyerName: name,
      buyerContact: phone,
      date: `${dayObj.dayName}, ${dayObj.monthDay}`,
      time: selectedTime,
    });

    setConfirmedBooking(newBooking);
  };

  const handleDone = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Request a Tour</h3>
              <p className="text-xs text-slate-500 truncate max-w-[280px] sm:max-w-xs">
                {property.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {confirmedBooking ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Tour Confirmed!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Your appointment pass has been issued and synced with the listing broker. A calendar invite was dispatched.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Property:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.propertyTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-bold text-emerald-700">{confirmedBooking.date} at {confirmedBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tour Format:</span>
                  <span className="font-semibold text-slate-800">
                    {tourType === "in_person" ? "In-Person Guided Viewing" : "Live Video Walkthrough"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pass Reference:</span>
                  <span className="font-mono text-slate-600 font-bold">{confirmedBooking.id.toUpperCase()}</span>
                </div>
              </div>

              <button
                onClick={handleDone}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tour Type Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTourType("in_person")}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                    tourType === "in_person"
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <Building2 className={`h-5 w-5 ${tourType === "in_person" ? "text-emerald-600" : "text-slate-400"}`} />
                  <div>
                    <div className="text-xs font-bold">In-Person Tour</div>
                    <div className="text-[11px] text-slate-500">Meet at property</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTourType("video")}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                    tourType === "video"
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <Video className={`h-5 w-5 ${tourType === "video" ? "text-emerald-600" : "text-slate-400"}`} />
                  <div>
                    <div className="text-xs font-bold">Video Walkthrough</div>
                    <div className="text-[11px] text-slate-500">Live 1-on-1 video call</div>
                  </div>
                </button>
              </div>

              {/* Day Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select a Day
                </label>
                <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                  {upcomingDays.map((day) => (
                    <button
                      key={day.fullDate}
                      type="button"
                      onClick={() => setSelectedDay(day.fullDate)}
                      className={`p-2 rounded-xl text-center border transition ${
                        selectedDay === day.fullDate
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-[10px] uppercase font-semibold">{day.dayName}</div>
                      <div className="text-xs font-extrabold mt-0.5">{day.monthDay.split(" ")[1]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select a Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        selectedTime === time
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" /> Confirm Free Tour
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero obligations. Free cancellation anytime.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
