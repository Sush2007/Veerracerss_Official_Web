"use client";

import React, { useState, useEffect } from "react";
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  Upload,
  Link as LinkIcon,
  X,
  AlertTriangle,
  Zap,
  Activity,
  Gauge,
  Weight,
  Cpu,
  Eye,
  RotateCcw
} from "lucide-react";
import { VehicleRecord, extractSpotlightFromVehicles } from "@/src/data/cms_defaults";

interface VehiclesTabProps {
  vehicles: VehicleRecord[];
  onSaveVehicles: (updatedVehicles: VehicleRecord[]) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  showToast: (msg: string) => void;
  showError: (msg: string) => void;
}

export function VehiclesTab({
  vehicles,
  onSaveVehicles,
  onUploadImage,
  showToast,
  showError,
}: VehiclesTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleRecord | null>(null);
  const [deleteConfirmVehicle, setDeleteConfirmVehicle] = useState<VehicleRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState<"EV" | "Combustion">("EV");
  const [tagline, setTagline] = useState("");
  const [competition, setCompetition] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [cadImage, setCadImage] = useState("");
  const [cadModelUrl, setCadModelUrl] = useState("/car-raw.glb");
  const [speed, setSpeed] = useState("120 km/h");
  const [accel, setAccel] = useState("3.0s 0-100");
  const [weight, setWeight] = useState("185 kg");
  const [power, setPower] = useState("72 kW Peak (Dual PMSM)");
  const [voltage, setVoltage] = useState("72V");
  const [featuresText, setFeaturesText] = useState("");
  const [isSpotlight, setIsSpotlight] = useState(false);

  // Subsystems
  const [powertrainHeadline, setPowertrainHeadline] = useState("");
  const [powertrainSpecs, setPowertrainSpecs] = useState("");
  const [accumulatorHeadline, setAccumulatorHeadline] = useState("");
  const [accumulatorSpecs, setAccumulatorSpecs] = useState("");
  const [chassisHeadline, setChassisHeadline] = useState("");
  const [chassisSpecs, setChassisSpecs] = useState("");
  const [aeroHeadline, setAeroHeadline] = useState("");
  const [aeroSpecs, setAeroSpecs] = useState("");

  // Lock background scroll when modals are open
  useEffect(() => {
    if (modalOpen || deleteConfirmVehicle) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [modalOpen, deleteConfirmVehicle]);

  // Find currently active spotlight car
  const activeSpotlightCar =
    vehicles.find((v) => v.is_spotlight) ||
    [...vehicles].sort((a, b) => parseInt(b.year || "0") - parseInt(a.year || "0"))[0];

  const openAddModal = () => {
    setEditingVehicle(null);
    setName("");
    setYear(new Date().getFullYear().toString());
    setCategory("EV");
    setTagline("NEXT-GEN ELECTRIC FORMULA PROTOTYPE");
    setCompetition("Formula Bharat 2026 / FSEV");
    setDescription("");
    setImage("/cars/aether.jpg");
    setCadImage("/cars/aether-cad.png");
    setCadModelUrl("/car-raw.glb");
    setSpeed("120 km/h");
    setAccel("3.0s 0-100");
    setWeight("185 kg");
    setPower("72 kW Peak Dual Motor");
    setVoltage("72V");
    setFeaturesText("Carbon Fiber Aerodynamics\nRegenerative Braking 4-Wheel Distribution\nIn-House Battery Management System (BMS)\nHigh-Torque Planetary Planetary Reduction");
    setIsSpotlight(true);
    setPowertrainHeadline("Dual Permanent Magnet Synchronous Motors");
    setPowertrainSpecs("85 Nm Peak Torque • Direct Chain Reduction • Active Thermal Management");
    setAccumulatorHeadline("72V High-Energy Lithium-Ion Pack");
    setAccumulatorSpecs("In-House Smart BMS • Optocoupled IMD Safety • Active Pyrometer Telemetry");
    setChassisHeadline("AISI 4130 Chromoly Spaceframe");
    setChassisSpecs("Torsional Rigidity 1850 Nm/deg • Double Wishbone Pushrod Suspension");
    setAeroHeadline("Carbon-Composite Aero Package");
    setAeroSpecs("Front & Rear Multi-Element Wings • Venturi Underbody Diffuser");
    setModalOpen(true);
  };

  const openEditModal = (vehicle: VehicleRecord) => {
    setEditingVehicle(vehicle);
    setName(vehicle.name || "");
    setYear(vehicle.year || "");
    setCategory(vehicle.category || "EV");
    setTagline(vehicle.tagline || "");
    setCompetition(vehicle.competition || "");
    setDescription(vehicle.description || "");
    setImage(vehicle.image || "");
    setCadImage(vehicle.cad_image || "");
    setCadModelUrl(vehicle.cad_model_url || "/car-raw.glb");
    setSpeed(vehicle.stats?.speed || "120 km/h");
    setAccel(vehicle.stats?.accel || "3.0s 0-100");
    setWeight(vehicle.stats?.weight || "185 kg");
    setPower(vehicle.stats?.power || "72 kW");
    setVoltage(vehicle.stats?.voltage || "72V");
    setFeaturesText(vehicle.features ? vehicle.features.join("\n") : "");
    setIsSpotlight(Boolean(vehicle.is_spotlight));
    setPowertrainHeadline(vehicle.subsystems?.powertrain_headline || "");
    setPowertrainSpecs(vehicle.subsystems?.powertrain_specs || "");
    setAccumulatorHeadline(vehicle.subsystems?.accumulator_headline || "");
    setAccumulatorSpecs(vehicle.subsystems?.accumulator_specs || "");
    setChassisHeadline(vehicle.subsystems?.chassis_headline || "");
    setChassisSpecs(vehicle.subsystems?.chassis_specs || "");
    setAeroHeadline(vehicle.subsystems?.aero_headline || "");
    setAeroSpecs(vehicle.subsystems?.aero_specs || "");
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "image" | "cadImage") => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImg(true);
      const url = await onUploadImage(file);
      if (target === "image") setImage(url);
      else setCadImage(url);
      showToast("Car image uploaded successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to upload image.");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSetSpotlight = async (vehicleId: string) => {
    try {
      const updated = vehicles.map((v) => ({
        ...v,
        is_spotlight: v.id === vehicleId,
      }));
      await onSaveVehicles(updated);
      showToast("Homepage Car Spotlight updated successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to update spotlight vehicle.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Please enter the vehicle name.");
      return;
    }
    if (!image.trim()) {
      showError("Please provide an image URL or upload a vehicle photo.");
      return;
    }

    try {
      setSaving(true);
      const parsedFeatures = featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const vehicleData: VehicleRecord = {
        id: editingVehicle ? editingVehicle.id : `car-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`,
        name: name.trim().toUpperCase(),
        year: year.trim(),
        category,
        tagline: tagline.trim(),
        competition: competition.trim(),
        description: description.trim(),
        image: image.trim(),
        cad_image: cadImage.trim() || image.trim(),
        cad_model_url: cadModelUrl.trim() || "/car-raw.glb",
        stats: {
          speed: speed.trim(),
          accel: accel.trim(),
          weight: weight.trim(),
          power: power.trim(),
          voltage: voltage.trim(),
        },
        features: parsedFeatures,
        subsystems: {
          powertrain_headline: powertrainHeadline.trim(),
          powertrain_specs: powertrainSpecs.trim(),
          accumulator_headline: accumulatorHeadline.trim(),
          accumulator_specs: accumulatorSpecs.trim(),
          chassis_headline: chassisHeadline.trim(),
          chassis_specs: chassisSpecs.trim(),
          aero_headline: aeroHeadline.trim(),
          aero_specs: aeroSpecs.trim(),
        },
        is_spotlight: isSpotlight,
      };

      let updatedList: VehicleRecord[];
      if (editingVehicle) {
        updatedList = vehicles.map((v) => {
          if (v.id === editingVehicle.id) {
            return vehicleData;
          }
          // If this vehicle was marked spotlight, unmark others
          return isSpotlight ? { ...v, is_spotlight: false } : v;
        });
      } else {
        // New car
        if (isSpotlight) {
          updatedList = [vehicleData, ...vehicles.map((v) => ({ ...v, is_spotlight: false }))];
        } else {
          updatedList = [vehicleData, ...vehicles];
        }
      }

      await onSaveVehicles(updatedList);
      setModalOpen(false);
      showToast(editingVehicle ? `Vehicle "${name}" updated!` : `Vehicle "${name}" added to fleet!`);
    } catch (err: any) {
      showError(err.message || "Failed to save vehicle.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmVehicle) return;
    try {
      const updated = vehicles.filter((v) => v.id !== deleteConfirmVehicle.id);
      await onSaveVehicles(updated);
      setDeleteConfirmVehicle(null);
      showToast(`Vehicle "${deleteConfirmVehicle.name}" removed from fleet.`);
    } catch (err: any) {
      showError(err.message || "Failed to remove vehicle.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Automatic Spotlight Sync Card */}
      <div className="bg-[#0b0c10] border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-racing-red" />
              <h2 className="text-xl font-bold font-display uppercase tracking-wide text-white">
                Fleet & Vehicles Management
              </h2>
            </div>
            <p className="text-white/60 text-xs mt-1">
              Add and manage team race cars with their specifications and high-resolution renders.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-racing-red hover:bg-racing-red/80 text-white px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-racing-red/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>

        {/* Dynamic Auto-Spotlight Status */}
        {activeSpotlightCar && (
          <div className="mt-6 bg-white/[0.02] border border-racing-red/40 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-sm bg-racing-red/10 border border-racing-red/40 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-racing-red fill-racing-red" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-racing-red font-bold">
                    HOMEPAGE CAR SPOTLIGHT (AUTOMATIC SYNC)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono px-1.5 py-0.5 uppercase">
                    Live On Home
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white font-display uppercase mt-0.5">
                  {activeSpotlightCar.name} ({activeSpotlightCar.year} {activeSpotlightCar.category})
                </h4>
                <p className="text-xs text-white/50 font-mono mt-0.5 line-clamp-1">
                  Speed: {activeSpotlightCar.stats?.speed} • 0-100: {activeSpotlightCar.stats?.accel} • Power: {activeSpotlightCar.stats?.power}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => openEditModal(activeSpotlightCar)}
                className="flex items-center gap-1.5 text-xs font-mono text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 transition-colors uppercase tracking-wider"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Specs</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fleet Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((car) => {
          const isSpotlightCar = activeSpotlightCar?.id === car.id;
          return (
            <div
              key={car.id}
              className={`bg-[#0b0c10] border transition-all flex flex-col group overflow-hidden ${
                isSpotlightCar ? "border-racing-red/60 shadow-[0_0_25px_rgba(210,39,48,0.15)]" : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Car Image Preview */}
              <div className="relative aspect-[16/10] bg-black/60 overflow-hidden border-b border-white/10">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="bg-racing-red text-white text-[10px] font-display font-black tracking-wider px-2 py-0.5 uppercase">
                    {car.name}
                  </span>
                  <span className="bg-black/80 backdrop-blur-sm text-white/80 border border-white/10 text-[9px] font-mono px-1.5 py-0.5 uppercase">
                    {car.year}
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 uppercase font-bold ${
                      car.category === "EV"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {car.category}
                  </span>
                </div>

                {isSpotlightCar && (
                  <div className="absolute bottom-2 left-2 bg-racing-red text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Active Homepage Spotlight</span>
                  </div>
                )}
              </div>

              {/* Vehicle Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-racing-red font-bold">
                    {car.competition}
                  </div>
                  <h3 className="text-base font-bold text-white font-display tracking-tight mt-1">
                    {car.name}
                  </h3>
                  {car.tagline && (
                    <p className="text-xs text-white/50 italic mt-0.5 font-mono line-clamp-1">
                      "{car.tagline}"
                    </p>
                  )}
                  <p className="text-xs text-white/70 mt-2.5 line-clamp-2 leading-relaxed">
                    {car.description}
                  </p>

                  {/* Core Telemetry Strip */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Gauge className="w-3.5 h-3.5 text-racing-red shrink-0" />
                      <span>{car.stats?.speed || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{car.stats?.accel || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Weight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{car.stats?.weight || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{car.stats?.voltage || car.stats?.power || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-white/10">
                  {!isSpotlightCar ? (
                    <button
                      onClick={() => handleSetSpotlight(car.id)}
                      className="flex items-center gap-1.5 text-[10px] font-mono text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 transition-colors uppercase tracking-wider"
                      title="Set as homepage spotlight"
                    >
                      <Star className="w-3 h-3 text-white/50" />
                      <span>Set Spotlight</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-racing-red font-bold uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Spotlight</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(car)}
                      className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      title="Edit vehicle details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmVehicle(car)}
                      className="p-1.5 text-red-400/80 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          ADD / EDIT VEHICLE MODAL
      ========================================================================= */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
          onClick={() => setModalOpen(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-white/20 w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed, Always Visible) */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0 bg-[#0b0c10] z-20">
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-racing-red" />
                <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wider text-white">
                  {editingVehicle ? `Edit Vehicle: ${editingVehicle.name}` : "Add New Fleet Vehicle"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/50 hover:text-white p-1 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dedicated Scrollable Form Body */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6"
              onWheel={(e) => e.stopPropagation()}
            >
              <form id="vehicle-editor-form" onSubmit={handleSave} className="space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-racing-red">
                  1. Identification & Competition
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Vehicle Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. AETHER"
                      required
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Model / Season Year *
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2025"
                      required
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as "EV" | "Combustion")}
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    >
                      <option value="EV">EV (Electric Vehicle)</option>
                      <option value="Combustion">Combustion (IC Engine)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Tagline / Concept Title
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. NEXT-GEN ELECTRIC FORMULA PROTOTYPE"
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Competition & Edition
                    </label>
                    <input
                      type="text"
                      value={competition}
                      onChange={(e) => setCompetition(e.target.value)}
                      placeholder="e.g. Formula Bharat 2026 / FSEV"
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    Vehicle Overview & Engineering Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe chassis design, development history, key competition achievements..."
                    className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white focus:border-racing-red focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Photos & CAD Assets */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-racing-red">
                  2. Visuals & 3D Schematics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Vehicle Track / Render Photo URL *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="/cars/aether.jpg or https://..."
                        required
                        className="flex-1 bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                      />
                      <label className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "image")}
                          disabled={uploadingImg}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      CAD / Blueprint Schematic URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cadImage}
                        onChange={(e) => setCadImage(e.target.value)}
                        placeholder="/cars/aether-cad.png or https://..."
                        className="flex-1 bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                      />
                      <label className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "cadImage")}
                          disabled={uploadingImg}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    3D GLB Model File URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={cadModelUrl}
                    onChange={(e) => setCadModelUrl(e.target.value)}
                    placeholder="/car-raw.glb"
                    className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                  />
                  <p className="text-[10px] text-white/40 mt-1 font-mono">
                    Used by the interactive 3D model canvas in Car Spotlight. Default is /car-raw.glb.
                  </p>
                </div>
              </div>

              {/* Engineering Specifications */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-racing-red">
                  3. Key Engineering Specifications
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Top Speed
                    </label>
                    <input
                      type="text"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      placeholder="120 km/h"
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Acceleration (0-100)
                    </label>
                    <input
                      type="text"
                      value={accel}
                      onChange={(e) => setAccel(e.target.value)}
                      placeholder="3.0s 0-100"
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Curb Weight
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="185 kg"
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Powertrain / Motor
                    </label>
                    <input
                      type="text"
                      value={power}
                      onChange={(e) => setPower(e.target.value)}
                      placeholder="72 kW Peak (Dual PMSM)"
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">
                      Battery / Voltage
                    </label>
                    <input
                      type="text"
                      value={voltage}
                      onChange={(e) => setVoltage(e.target.value)}
                      placeholder="72V"
                      className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSpotlight}
                        onChange={(e) => setIsSpotlight(e.target.checked)}
                        className="w-4 h-4 accent-racing-red"
                      />
                      <span className="text-xs font-mono font-bold text-racing-red uppercase">
                        Spotlight on Homepage
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    Technical Highlights & Features (1 per line)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="Carbon Fiber Aerodynamics&#10;Regenerative Braking 4-Wheel Distribution&#10;In-House Battery Management System (BMS)"
                    className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:border-racing-red focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Subsystems for Car Spotlight */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-racing-red">
                    4. Detailed Subsystem Schematics (Spotlight Sync)
                  </h4>
                  <span className="text-[10px] font-mono text-white/40 uppercase">
                    Auto-feeds Homepage Spotlight
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 p-3 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                      Powertrain Headline & Specs
                    </span>
                    <input
                      type="text"
                      value={powertrainHeadline}
                      onChange={(e) => setPowertrainHeadline(e.target.value)}
                      placeholder="e.g. Dual Permanent Magnet Synchronous Motors"
                      className="w-full bg-[#111111] border border-white/10 px-2.5 py-1.5 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                    <input
                      type="text"
                      value={powertrainSpecs}
                      onChange={(e) => setPowertrainSpecs(e.target.value)}
                      placeholder="85 Nm Peak Torque • Direct Chain Reduction"
                      className="w-full bg-[#111111] border border-white/10 px-2.5 py-1.5 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-3 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                      Battery Pack Headline & Specs
                    </span>
                    <input
                      type="text"
                      value={accumulatorHeadline}
                      onChange={(e) => setAccumulatorHeadline(e.target.value)}
                      placeholder="e.g. 72V High-Energy Lithium-Ion Pack"
                      className="w-full bg-[#111111] border border-white/10 px-2.5 py-1.5 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                    <input
                      type="text"
                      value={accumulatorSpecs}
                      onChange={(e) => setAccumulatorSpecs(e.target.value)}
                      placeholder="In-House Smart BMS • IP67 Isolation"
                      className="w-full bg-[#111111] border border-white/10 px-2.5 py-1.5 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-3 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                      Spaceframe Chassis Headline & Specs
                    </span>
                    <input
                      type="text"
                      value={chassisHeadline}
                      onChange={(e) => setChassisHeadline(e.target.value)}
                      placeholder="e.g. AISI 4130 Chromoly Spaceframe"
                      className="w-full bg-[#111111] border border-white/10 px-2.5 py-1.5 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                    <input
                      type="text"
                      value={chassisSpecs}
                      onChange={(e) => setChassisSpecs(e.target.value)}
                      placeholder="Torsional Rigidity 1850 Nm/deg • Double Wishbone"
                      className="w-full bg-[#111111] border border-white/10 px-2.5 py-1.5 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-3 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/80 font-bold block">
                      Aerodynamics Package Headline & Specs
                    </span>
                    <input
                      type="text"
                      value={aeroHeadline}
                      onChange={(e) => setAeroHeadline(e.target.value)}
                      placeholder="e.g. Carbon-Composite Aero Package"
                      className="w-full bg-[#111111] border border-white/10 px-2.5 py-1.5 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                    <input
                      type="text"
                      value={aeroSpecs}
                      onChange={(e) => setAeroSpecs(e.target.value)}
                      placeholder="Multi-Element Wings • Venturi Underbody Diffuser"
                      className="w-full bg-[#111111] border border-white/10 px-2.5 py-1.5 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              </form>
            </div>

            {/* Modal Footer (Fixed, Always Visible) */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 shrink-0 bg-[#0b0c10] z-20">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="vehicle-editor-form"
                disabled={saving || uploadingImg}
                className="px-6 py-2 text-xs font-mono uppercase tracking-wider font-bold bg-racing-red hover:bg-racing-red/80 text-white transition-colors disabled:opacity-50 shadow-lg shadow-racing-red/20"
              >
                {saving ? "Saving Vehicle..." : editingVehicle ? "Save Changes" : "Add Vehicle to Fleet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
      ========================================================================= */}
      {deleteConfirmVehicle && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmVehicle(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-red-500/40 p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                Delete Vehicle Record
              </h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-mono">
              Are you sure you want to delete <span className="text-white font-bold">{deleteConfirmVehicle.name} ({deleteConfirmVehicle.year})</span> from the fleet?
              {deleteConfirmVehicle.is_spotlight && (
                <span className="block mt-2 text-amber-400 font-bold">
                  Note: This car is currently the Homepage Spotlight. Deleting it will automatically promote the next newest car as the spotlight.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteConfirmVehicle(null)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg shadow-red-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
