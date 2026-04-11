"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  RiHome4Line,
  RiMapPin2Line,
  RiCameraLine,
  RiMoneyDollarCircleLine,
  RiCheckLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiFilePdfLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { PROPERTY_TYPES, FACING, TAGS, PLANS } from "@/constants";
import GPSPicker from "@/components/property/gps-picker";

const STEPS = [
  { id: 1, label: "Property Type", icon: RiHome4Line },
  { id: 2, label: "Details", icon: RiMapPin2Line },
  { id: 3, label: "Photos", icon: RiCameraLine },
  { id: 4, label: "Documents", icon: RiFilePdfLine },
  { id: 5, label: "Pricing", icon: RiMoneyDollarCircleLine },
];

function validate(step, form, photos) {
  const errors = {};
  if (step === 1) {
    if (!form.type) errors.type = "Please select a property type";
  }
  if (step === 2) {
    if (!form.title.trim()) errors.title = "Title is required";
    if (form.title.length < 10)
      errors.title = "Title must be at least 10 characters";
    if (!form.address.area.trim()) errors.area = "Area / locality is required";
    if (!form.address.city.trim()) errors.city = "City is required";
    if (!form.facing) errors.facing = "Please select facing direction";
    // location is optional — no validation
    if (["villa", "apartment", "highrise", "house"].includes(form.type)) {
      if (!form.fields.bhk) errors.bhk = "BHK is required";
      if (!form.fields.sft) errors.sft = "Built-up area is required";
    }
    if (["plot", "land"].includes(form.type)) {
      if (!form.fields.sqYards) errors.sqYards = "Area in Sq Yards is required";
    }
  }
  if (step === 3) {
    if (photos.length < 3) errors.photos = "Minimum 3 photos required";
    if (photos.length > 30) errors.photos = "Maximum 30 photos allowed";
  }
  if (step === 5) {
    if (!form.price) errors.price = "Asking price is required";
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0)
      errors.price = "Enter a valid price";
    if (!form.plan) errors.plan = "Please select a plan";
  }
  return errors;
}

async function uploadFile(file, type) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("type", type);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.url;
}

export default function PostPropertyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: "",
    title: "",
    price: "",
    facing: "",
    tags: [],
    plan: "manual",
    address: { area: "", city: "", state: "", pincode: "" },
    fields: {},
    location: null,
  });
  const [photos, setPhotos] = useState([]);
  const [docs, setDocs] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const photoRef = useRef(null);
  const docRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = !!editId;

  // Load existing property data when editing
  useEffect(() => {
    if (!editId) return;
    fetch(`/api/properties/${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        const p = data.data;
        setForm({
          type: p.type || "",
          title: p.title || "",
          price: p.price ? (p.price / 100000).toString() : "",
          facing: p.facing || "",
          tags: p.tags || [],
          plan: p.plan || "manual",
          address: p.address || { area: "", city: "", state: "", pincode: "" },
          fields: p.fields || {},
          location: p.location
            ? {
                lat: p.location.coordinates[1],
                lng: p.location.coordinates[0],
                address: p.location.address || "",
              }
            : null,
        });
        // Pre-fill existing photos
        if (p.photos?.length > 0) {
          setPhotos(
            p.photos.map((ph) => ({
              file: null,
              preview: ph.url,
              url: ph.url,
              uploading: false,
              error: null,
            })),
          );
        }
        // Pre-fill existing docs
        if (p.documents?.length > 0) {
          setDocs(
            p.documents.map((d) => ({
              file: null,
              name: d.name,
              url: d.url,
              uploading: false,
              error: null,
            })),
          );
        }
      })
      .catch(console.error);
  }, [editId]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setAddr = (k, v) =>
    setForm((p) => ({ ...p, address: { ...p.address, [k]: v } }));
  const setFields = (k, v) =>
    setForm((p) => ({ ...p, fields: { ...p.fields, [k]: v } }));
  const toggleTag = (t) =>
    set(
      "tags",
      form.tags.includes(t)
        ? form.tags.filter((x) => x !== t)
        : [...form.tags, t],
    );

  async function handlePhotos(files) {
    const newPhotos = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      url: null,
      uploading: true,
      error: null,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    for (let i = 0; i < newPhotos.length; i++) {
      const idx = photos.length + i;
      try {
        const url = await uploadFile(newPhotos[i].file, "image");
        setPhotos((prev) =>
          prev.map((p, j) => (j === idx ? { ...p, url, uploading: false } : p)),
        );
      } catch (e) {
        setPhotos((prev) =>
          prev.map((p, j) =>
            j === idx ? { ...p, uploading: false, error: e.message } : p,
          ),
        );
      }
    }
  }

  async function handleDoc(file) {
    const idx = docs.length;
    setDocs((prev) => [
      ...prev,
      { file, name: file.name, url: null, uploading: true, error: null },
    ]);
    try {
      const url = await uploadFile(file, "document");
      setDocs((prev) =>
        prev.map((d, i) => (i === idx ? { ...d, url, uploading: false } : d)),
      );
    } catch (e) {
      setDocs((prev) =>
        prev.map((d, i) =>
          i === idx ? { ...d, uploading: false, error: e.message } : d,
        ),
      );
    }
  }

  function next() {
    const errs = validate(step, form, photos);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  }

  function back() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function submit() {
    const errs = validate(5, form, photos);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (photos.some((p) => p.uploading)) {
      setSubmitError("Some photos are still uploading. Please wait.");
      return;
    }
    setLoading(true);
    setSubmitError("");
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) * 100000,
        priceLabel: `₹${form.price} L`,
        trust: "basic",
        isActive: true,
        photos: photos
          .filter((p) => p.url)
          .map((p) => ({ url: p.url, isLive: false })),
        documents: docs
          .filter((d) => d.url)
          .map((d) => ({ url: d.url, name: d.name })),
        location: form.location, // null if not pinned — that's fine
      };
      const url = isEdit ? `/api/properties/${editId}` : "/api/properties";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      router.push(
        isEdit
          ? `/property/${editId}?updated=true`
          : `/property/${data.data._id}?posted=true`,
      );
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const err = (key) =>
    errors[key] ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <RiErrorWarningLine className="flex-shrink-0" />
        {errors[key]}
      </p>
    ) : null;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const current = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${done ? "bg-green-600 text-white" : current ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-gray-200 text-gray-500"}`}
                  >
                    {done ? <RiCheckLine /> : <Icon />}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${current ? "text-green-600" : "text-gray-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 rounded ${step > s.id ? "bg-green-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">
                What are you selling?
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Select the type of property.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROPERTY_TYPES.filter((t) => t.value !== "all").map(
                  ({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => {
                        set("type", value);
                        setErrors({});
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${form.type === value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"}`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {label}
                      </span>
                    </button>
                  ),
                )}
              </div>
              {err("type")}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">
                Property Details
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Tell buyers about your property.
              </p>

              <div>
                <label className="lbl">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. 3 BHK Villa with Garden in Jubilee Hills"
                  className={`inp ${errors.title ? "border-red-400" : ""}`}
                />
                {err("title")}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="lbl">Area / Locality</label>
                  <input
                    value={form.address.area}
                    onChange={(e) => setAddr("area", e.target.value)}
                    placeholder="Jubilee Hills"
                    className={`inp ${errors.area ? "border-red-400" : ""}`}
                  />
                  {err("area")}
                </div>
                <div>
                  <label className="lbl">City</label>
                  <input
                    value={form.address.city}
                    onChange={(e) => setAddr("city", e.target.value)}
                    placeholder="Hyderabad"
                    className={`inp ${errors.city ? "border-red-400" : ""}`}
                  />
                  {err("city")}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="lbl">State</label>
                  <input
                    value={form.address.state}
                    onChange={(e) => setAddr("state", e.target.value)}
                    placeholder="Telangana"
                    className="inp"
                  />
                </div>
                <div>
                  <label className="lbl">Pincode</label>
                  <input
                    value={form.address.pincode}
                    onChange={(e) =>
                      setAddr("pincode", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="500032"
                    maxLength={6}
                    inputMode="numeric"
                    className="inp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["villa", "apartment", "highrise", "house"].includes(
                  form.type,
                ) && (
                  <div>
                    <label className="lbl">BHK</label>
                    <select
                      value={form.fields.bhk || ""}
                      onChange={(e) =>
                        setFields("bhk", parseInt(e.target.value))
                      }
                      className={`inp ${errors.bhk ? "border-red-400" : ""}`}
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} BHK
                        </option>
                      ))}
                    </select>
                    {err("bhk")}
                  </div>
                )}
                <div>
                  <label className="lbl">Facing</label>
                  <select
                    value={form.facing}
                    onChange={(e) => set("facing", e.target.value)}
                    className={`inp ${errors.facing ? "border-red-400" : ""}`}
                  >
                    <option value="">Select</option>
                    {FACING.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  {err("facing")}
                </div>
              </div>

              {["villa", "apartment", "highrise", "house"].includes(
                form.type,
              ) && (
                <div>
                  <label className="lbl">Built-up Area (Sq ft)</label>
                  <input
                    type="number"
                    value={form.fields.sft || ""}
                    onChange={(e) => setFields("sft", parseInt(e.target.value))}
                    placeholder="1500"
                    className={`inp ${errors.sft ? "border-red-400" : ""}`}
                  />
                  {err("sft")}
                </div>
              )}

              {["plot", "land"].includes(form.type) && (
                <div>
                  <label className="lbl">Area (Sq Yards)</label>
                  <input
                    type="number"
                    value={form.fields.sqYards || ""}
                    onChange={(e) =>
                      setFields("sqYards", parseInt(e.target.value))
                    }
                    placeholder="200"
                    className={`inp ${errors.sqYards ? "border-red-400" : ""}`}
                  />
                  {err("sqYards")}
                </div>
              )}

              <div>
                <label className="lbl">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {TAGS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      type="button"
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${form.tags.includes(t) ? "bg-green-50 text-green-700 border-green-400" : "border-gray-200 text-gray-600 hover:border-green-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="lbl">
                  Property Location on Map
                  <span className="ml-1 text-gray-400 normal-case font-normal">
                    (optional)
                  </span>
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Pin the exact location of the property on the map. Required.
                </p>
                <GPSPicker
                  value={form.location}
                  onChange={(loc) => set("location", loc)}
                />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">
                Property Photos
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Min 3, max 30 photos. Clear photos = more bids.
              </p>
              <div
                onClick={() => photoRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer mb-4"
              >
                <RiCameraLine className="text-gray-300 text-4xl mx-auto mb-2" />
                <p className="font-semibold text-gray-600 text-sm">
                  Click to add photos
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP · Max 10MB each
                </p>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePhotos(e.target.files)}
                />
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {photos.map((p, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                    >
                      <img
                        src={p.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {p.uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {p.error && (
                        <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                          <RiErrorWarningLine className="text-white text-xl" />
                        </div>
                      )}
                      {!p.uploading && (
                        <button
                          onClick={() =>
                            setPhotos((prev) => prev.filter((_, j) => j !== i))
                          }
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <RiDeleteBinLine className="text-xs" />
                        </button>
                      )}
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded font-semibold">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400">
                {photos.length} / 30 photos added
              </p>
              {err("photos")}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-semibold text-amber-700">
                  GPS Stamp Required
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Photos taken on-site will be GPS-stamped to verify listing
                  authenticity.
                </p>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">
                Property Documents
              </h2>
              <p className="text-gray-400 text-sm mb-2">
                Optional for Basic plan. Required for Manual/Legal verification.
              </p>
              <p className="text-xs text-gray-400 mb-5">
                Accepted: PDF, JPG, PNG · Max 20MB each
              </p>
              <div
                onClick={() => docRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer mb-4"
              >
                <RiFilePdfLine className="text-gray-300 text-4xl mx-auto mb-2" />
                <p className="font-semibold text-gray-600 text-sm">
                  Click to upload documents
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Sale deed, Encumbrance certificate, Patta, etc.
                </p>
                <input
                  ref={docRef}
                  type="file"
                  accept=".pdf,image/*"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    Array.from(e.target.files).forEach((f) => handleDoc(f))
                  }
                />
              </div>
              {docs.length > 0 && (
                <div className="space-y-2">
                  {docs.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <RiFilePdfLine className="text-red-500 text-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {d.name}
                        </p>
                        {d.uploading && (
                          <p className="text-xs text-blue-500">Uploading...</p>
                        )}
                        {d.error && (
                          <p className="text-xs text-red-500">{d.error}</p>
                        )}
                        {d.url && (
                          <p className="text-xs text-green-600">Uploaded</p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setDocs((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">
                You can skip this and upload later from your dashboard.
              </p>
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">
                Price & Plan
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Set your asking price and verification level.
              </p>
              <div>
                <label className="lbl">Asking Price (₹ Lakhs)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="85"
                  className={`inp text-xl font-bold ${errors.price ? "border-red-400" : ""}`}
                />
                {form.price && !errors.price && (
                  <p className="text-xs text-gray-400 mt-1">
                    = ₹
                    {(parseFloat(form.price) * 100000).toLocaleString("en-IN")}
                  </p>
                )}
                {err("price")}
              </div>
              <div>
                <label className="lbl mb-2 block">Verification Plan</label>
                <div className="space-y-2.5">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.key}
                      onClick={() => set("plan", plan.key)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${form.plan === plan.key ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"}`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${plan.dotClass}`}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">
                          {plan.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {plan.features[0]}
                        </p>
                      </div>
                      <span className="font-black text-gray-900 text-sm">
                        {plan.priceLabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {submitError && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl flex items-center gap-2">
                  <RiErrorWarningLine />
                  {submitError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={back}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-0 transition-all"
          >
            <RiArrowLeftLine /> Back
          </button>
          {step < 5 ? (
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all"
            >
              Continue <RiArrowRightLine />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all"
            >
              {loading ? (
                isEdit ? (
                  "Updating..."
                ) : (
                  "Submitting..."
                )
              ) : (
                <>
                  <RiCheckLine /> {isEdit ? "Update Property" : "Post Property"}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .lbl { display:block; font-size:0.7rem; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px; }
        .inp { display:block; width:100%; padding:0.7rem 1rem; font-size:0.875rem; border:1px solid #e5e7eb; border-radius:0.75rem; outline:none; transition:all 0.15s; background:white; }
        .inp:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.1); }
      `}</style>
    </div>
  );
}
