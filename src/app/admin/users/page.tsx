"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  Users, Search, Filter, 
  ShieldCheck, MoreVertical, 
  Trash2, Edit, Zap,
  CheckCircle2, XCircle, Mail
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { adminService } from "@/services/adminService";

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && (!session || (session.user as any).role !== "SUPER_ADMIN")) {
      router.push("/dashboard");
    } else if (session) {
      fetchUsers();
    }
  }, [session, isPending, router]);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      if (data.success) setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  if (isPending || loading) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <Zap className="w-10 h-10 text-primary animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] p-12 overflow-y-auto">
        <header className="mb-12 flex items-center justify-between">
           <div>
              <div className="flex items-center gap-3 mb-2 text-primary font-bold uppercase tracking-widest text-xs">
                 <ShieldCheck size={16} /> User Registry
              </div>
              <h1 className="text-4xl font-black tracking-tight">Authority <span className="text-text-muted">Control</span></h1>
           </div>
           <div className="flex gap-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search users..." 
                   className="pl-12 pr-6 py-4 bg-bg-card border border-border rounded-2xl outline-none focus:border-primary text-sm font-medium w-80 shadow-xl shadow-black/5"
                 />
              </div>
              <button className="p-4 bg-bg-card border border-border rounded-2xl text-text-muted hover:text-primary transition-all">
                 <Filter size={18} />
              </button>
           </div>
        </header>

        <div className="bg-bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-2xl shadow-black/5">
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left bg-bg-main/50 border-b border-border">
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Identity</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Strategic Role</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Assets</th>
                       <th className="p-8 text-right text-[10px] font-black uppercase tracking-widest text-text-muted">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                    {users.map((user, i) => (
                       <motion.tr 
                         key={user.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className="hover:bg-bg-main/30 transition-all group"
                       >
                          <td className="p-8">
                             <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/10 p-0.5">
                                   <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full object-cover rounded-[0.7rem]" alt="" />
                                </div>
                                <div>
                                   <p className="font-black text-sm group-hover:text-primary transition-colors">{user.name}</p>
                                   <div className="flex items-center gap-2 text-text-muted text-[10px] font-bold">
                                      <Mail size={10} /> {user.email}
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                user.isOnboarded 
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                             }`}>
                                {user.isOnboarded ? 'Verified' : 'Pending'}
                             </span>
                          </td>
                          <td className="p-8">
                             <select 
                               value={user.role}
                               onChange={(e) => handleRoleChange(user.id, e.target.value)}
                               className="bg-bg-main border border-border px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary appearance-none cursor-pointer"
                             >
                                <option value="FREELANCER">Freelancer</option>
                                <option value="CLIENT">Client</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                             </select>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-6">
                                <div>
                                   <p className="text-xs font-black">{user._count?.postedProjects || 0}</p>
                                   <p className="text-[10px] text-text-muted font-bold uppercase">Projects</p>
                                </div>
                                <div>
                                   <p className="text-xs font-black">{user._count?.bids || 0}</p>
                                   <p className="text-[10px] text-text-muted font-bold uppercase">Bids</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-3 bg-bg-main border border-border rounded-xl hover:bg-white transition-all text-text-muted hover:text-primary">
                                   <Edit size={16} />
                                </button>
                                <button className="p-3 bg-bg-main border border-border rounded-xl hover:bg-red-500 hover:text-white transition-all text-text-muted">
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
}
