"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";
import { LogOut, Upload, UserPlus, Trash2, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  
  // Tabs: "members" | "moments"
  const [activeTab, setActiveTab] = useState("members");

  // Data
  const [members, setMembers] = useState<any[]>([]);
  const [moments, setMoments] = useState<any[]>([]);
  
  // Generic Upload State
  const [uploading, setUploading] = useState(false);

  // Form State (Members)
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Leadership");
  const [file, setFile] = useState<File | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");

  // Form State (Moments)
  const [momentYear, setMomentYear] = useState(new Date().getFullYear().toString());
  const [momentLabel, setMomentLabel] = useState("");
  const [momentFile, setMomentFile] = useState<File | null>(null);

  const departments = ["Leadership", "Powertrain & Drivetrain", "Chassis", "Suspension", "Brakes"];

  useEffect(() => {
    checkUser();
    fetchData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/admin/login");
    } else {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const { data: mData } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (mData) setMembers(mData);

    const { data: pData } = await supabase.from('pinnacle_moments').select('*').order('created_at', { ascending: false });
    if (pData) setMoments(pData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a profile image");
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('member-images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('member-images').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('members').insert([{
        name, role, department, image_url: publicUrl, linkedin: linkedin || "#", instagram: instagram || "#"
      }]);
      if (dbError) throw dbError;

      setName(""); setRole(""); setFile(null); setLinkedin(""); setInstagram("");
      fetchData();
      alert("Member added successfully!");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMomentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentFile) return alert("Please select an image");
    setUploading(true);

    try {
      const fileExt = momentFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('moment-images').upload(fileName, momentFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('moment-images').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('pinnacle_moments').insert([{
        year: momentYear, label: momentLabel, image_url: publicUrl
      }]);
      if (dbError) throw dbError;

      setMomentLabel(""); setMomentFile(null);
      fetchData();
      alert("Pinnacle Moment added successfully!");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Remove this member?")) return;
    await supabase.from('members').delete().eq('id', id);
    fetchData();
  };

  const deleteMoment = async (id: string) => {
    if (!confirm("Remove this moment?")) return;
    await supabase.from('pinnacle_moments').delete().eq('id', id);
    fetchData();
  };

  if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest font-display text-racing-red">Command Center</h1>
            <p className="text-white/50 text-sm mt-1">Manage team members and website data</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </header>

        {/* Custom Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-bold uppercase tracking-widest rounded-lg transition-colors ${activeTab === 'members' ? 'bg-racing-red text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            Team Members
          </button>
          <button 
            onClick={() => setActiveTab('moments')}
            className={`px-6 py-3 font-bold uppercase tracking-widest rounded-lg transition-colors ${activeTab === 'moments' ? 'bg-racing-red text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            Pinnacle Moments
          </button>
        </div>

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-3xl">
                <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-racing-red" /> Add New Member
                </h2>
                <form onSubmit={handleMemberSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Full Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 focus:border-racing-red outline-none" />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Role / Title</label>
                    <input type="text" required value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Aerodynamics Lead" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 focus:border-racing-red outline-none" />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Department</label>
                    <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 focus:border-racing-red outline-none text-white">
                      {departments.map(d => <option key={d} value={d} className="bg-black text-white">{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Profile Picture</label>
                    <label className="w-full bg-black/50 border border-dashed border-white/20 rounded-lg px-3 py-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                      <Upload className="w-5 h-5 text-white/50 mb-2" />
                      <span className="text-sm text-white/70">{file ? file.name : "Click to upload image"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase text-white/50 mb-1 block">LinkedIn URL</label>
                      <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 focus:border-racing-red outline-none" />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-white/50 mb-1 block">Instagram URL</label>
                      <input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 focus:border-racing-red outline-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={uploading} className="w-full bg-racing-red text-white font-bold uppercase py-3 rounded-lg mt-2 hover:bg-[#ff5500] disabled:opacity-50">
                    {uploading ? "Uploading..." : "Save Member"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="glass-panel p-6 rounded-3xl h-full">
                  <h2 className="text-xl font-bold uppercase mb-6 border-b border-white/10 pb-4">Active Roster ({members.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                    {members.map(member => (
                      <div key={member.id} className="bg-black/50 border border-white/10 rounded-xl p-4 flex gap-4 items-center group relative">
                        <img src={member.image_url} alt={member.name} className="w-16 h-16 rounded-full object-cover border border-white/20" />
                        <div>
                          <h3 className="font-bold text-white">{member.name}</h3>
                          <p className="text-xs text-racing-red uppercase tracking-widest">{member.department}</p>
                          <p className="text-xs text-white/50">{member.role}</p>
                        </div>
                        <button onClick={() => deleteMember(member.id)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {members.length === 0 && <div className="col-span-2 text-center text-white/30 py-12">No members added yet.</div>}
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* MOMENTS TAB */}
        {activeTab === 'moments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-3xl">
                <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-racing-red" /> Add Pinnacle Moment
                </h2>
                <form onSubmit={handleMomentSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Year</label>
                    <select value={momentYear} onChange={e => setMomentYear(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 focus:border-racing-red outline-none text-white">
                      {Array.from({ length: 9 }, (_, i) => 2022 + i).map(year => (
                        <option key={year} value={year} className="bg-black text-white">{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Label / Description</label>
                    <textarea required value={momentLabel} onChange={e => setMomentLabel(e.target.value)} placeholder="e.g. Formula Bharat Winners" rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 focus:border-racing-red outline-none resize-none" />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">High-Res Image</label>
                    <label className="w-full bg-black/50 border border-dashed border-white/20 rounded-lg px-3 py-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                      <Upload className="w-5 h-5 text-white/50 mb-2" />
                      <span className="text-sm text-white/70">{momentFile ? momentFile.name : "Click to upload image"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => setMomentFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <button type="submit" disabled={uploading} className="w-full bg-racing-red text-white font-bold uppercase py-3 rounded-lg mt-2 hover:bg-[#ff5500] disabled:opacity-50">
                    {uploading ? "Uploading..." : "Save Moment"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="glass-panel p-6 rounded-3xl h-full">
                  <h2 className="text-xl font-bold uppercase mb-6 border-b border-white/10 pb-4">Gallery ({moments.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                    {moments.map(moment => (
                      <div key={moment.id} className="bg-black/50 border border-white/10 rounded-xl overflow-hidden flex flex-col group relative">
                        <div className="h-40 w-full overflow-hidden">
                           <img src={moment.image_url} alt={moment.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-racing-red font-bold font-mono tracking-widest uppercase mb-1">{moment.year}</p>
                          <p className="text-sm text-white">{moment.label}</p>
                        </div>
                        <button onClick={() => deleteMoment(moment.id)} className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition-all shadow-lg backdrop-blur-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {moments.length === 0 && <div className="col-span-2 text-center text-white/30 py-12">No moments added yet.</div>}
                  </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
