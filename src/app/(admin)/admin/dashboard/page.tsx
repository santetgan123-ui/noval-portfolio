'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/types';
import {
  UploadIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  ExternalLinkIcon,
  GitHubIcon,
  WarningIcon,
  InfoIcon
} from '@/components/ui';
import { SVGSpinner } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Status and feedback messaging states
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [dashboardSuccess, setDashboardSuccess] = useState<string | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);

  const router = useRouter();

  // Form input state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    image: null as File | null,
    live_url: '',
    github_url: '',
  });

  useEffect(() => {
    fetchProjects();
    loadCurrentResumeUrl();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setDashboardError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setDashboardError(error.message);
        return;
      }

      setProjects((data as Project[]) ?? []);
    } catch (err) {
      setDashboardError(err instanceof Error ? err.message : 'Gagal memuat daftar proyek.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-thumbnails')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah berkas gambar: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('project-thumbnails')
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Gagal mendapatkan tautan publik untuk berkas gambar.');
    }

    return publicUrlData.publicUrl;
  };

  const handleResumeUpload = async (file: File): Promise<string> => {
    // Fitur ini dinonaktifkan sementara. Gunakan penggantian file manual di folder public/resume/
    throw new Error('Fitur upload dinonaktifkan. Silakan ganti file secara manual di folder public/resume/ dan push ke GitHub.');
  };

  const loadCurrentResumeUrl = async () => {
    // Selalu gunakan file lokal statis
    setCurrentResumeUrl('/resume/CV_Frontend_Backend (1).pdf');
  };
  const triggerRevalidation = async () => {
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Gagal memperbarui cache server global.');
      }
    } catch (err) {
      // Revalidation warning is logged internally, but does not block dashboard experience
      console.warn('Revalidation warning:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    if (!formData.image) {
      setFormError('Harap pilih gambar penjelas (thumbnail) proyek terlebih dahulu.');
      setFormLoading(false);
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await handleImageUpload(formData.image);
      setUploading(false);

      const supabase = createClient();
      const techStackArray = formData.tech_stack
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const { error: insertError } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            tech_stack: techStackArray,
            image_url: imageUrl,
            live_url: formData.live_url || null,
            github_url: formData.github_url || null,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      setFormSuccess('Proyek berhasil ditambahkan ke database.');
      
      // Reset form fields
      setFormData({
        title: '',
        description: '',
        tech_stack: '',
        image: null,
        live_url: '',
        github_url: '',
      });
      
      // Close form panel after delay
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess(null);
      }, 1500);

      // Revalidate Next.js cache and refresh UI
      await triggerRevalidation();
      router.refresh();
      await fetchProjects();
    } catch (err) {
      setUploading(false);
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan data proyek.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    setDeleting(id);
    setDashboardError(null);
    setDashboardSuccess(null);

    try {
      const supabase = createClient();
      
      // 1. Delete record from database
      const { error: dbError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (dbError) {
        throw dbError;
      }

      // 2. Parse filename and delete object from storage if url is present
      if (imageUrl) {
        const parts = imageUrl.split('/project-thumbnails/');
        if (parts.length > 1) {
          const fileName = parts[1].split('?')[0];
          if (fileName) {
            await supabase.storage
              .from('project-thumbnails')
              .remove([fileName]);
          }
        }
      }

      setDashboardSuccess('Proyek berhasil dihapus beserta aset gambar terkait.');
      
      setTimeout(() => {
        setDashboardSuccess(null);
      }, 3000);

      // Revalidate cache and refresh list
      await triggerRevalidation();
      router.refresh();
      await fetchProjects();
    } catch (err) {
      setDashboardError(err instanceof Error ? err.message : 'Gagal menghapus proyek dari database.');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      setDashboardError('Gagal melakukan proses keluar.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <SVGSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-zinc-400 mt-1">Kelola proyek portofolio Anda secara real-time.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowResumeModal(true)}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-lg transition-colors text-sm"
            >
              Kelola Resume
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Tambah Proyek</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-lg transition-colors text-sm"
            >
              Keluar
            </button>
          </div>
        </div>

        <div className="mb-10 rounded-3xl border border-emerald-600/20 bg-emerald-950/10 p-6 text-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Upload Resume PDF</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Untuk mengunggah file resume baru, klik tombol <span className="font-semibold text-emerald-300">Kelola Resume</span> di samping.
                Ketika berhasil, kamu akan menemukan tombol <span className="font-semibold text-emerald-300">Unggah Resume PDF</span> di panel berikutnya.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowResumeModal(true)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Buka Panel Resume
            </button>
          </div>
        </div>

        {/* Global Dashboard Feedback Notification */}
        {dashboardError && (
          <div className="mb-8 p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-400">
            <WarningIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-200 text-sm">Kesalahan Sistem</h4>
              <p className="text-xs text-red-400/90 mt-1">{dashboardError}</p>
            </div>
          </div>
        )}

        {dashboardSuccess && (
          <div className="mb-8 p-4 bg-green-950/40 border border-green-800/60 rounded-xl flex items-start gap-3 text-green-400">
            <CheckIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-200 text-sm">Transaksi Berhasil</h4>
              <p className="text-xs text-green-400/90 mt-1">{dashboardSuccess}</p>
            </div>
          </div>
        )}

        {/* Resume Upload Modal */}
        {showResumeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Kelola Resume</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowResumeModal(false);
                    setResumeError(null);
                    setResumeSuccess(null);
                  }}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Upload Resume Baru</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Unggah file PDF baru untuk resume. File lama akan otomatis tergantikan.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentResumeUrl ? (
                <div className="flex gap-2">
                  <a
                    href={currentResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors text-sm font-semibold"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                    Buka Preview
                  </a>
                  <button
                    onClick={() => {
                      // Hapus query string (?t=...) agar link bersih
                      const cleanUrl = currentResumeUrl.split('?')[0];
                      navigator.clipboard.writeText(cleanUrl);
                      alert('Link PDF berhasil disalin!');
                    }}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 text-sm"
                  >
                    Salin Link
                  </button>
                </div>
              ) : (
                <span className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg text-sm">Resume belum tersedia</span>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              {resumeError && (
                <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-3 text-red-400">
                  <WarningIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-200 text-sm">Kesalahan Upload</h4>
                    <p className="text-xs text-red-400/90 mt-1">{resumeError}</p>
                  </div>
                </div>
              )}

              {resumeSuccess && (
                <div className="p-4 bg-green-950/40 border border-green-800/60 rounded-lg flex items-start gap-3 text-green-400">
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-200 text-sm">Resume Terunggah</h4>
                    <p className="text-xs text-green-400/90 mt-1">{resumeSuccess}</p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Pilih PDF Resume</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500 transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    if (!resumeFile) {
                      setResumeError('Pilih file PDF resume terlebih dahulu.');
                      return;
                    }
                    setResumeError(null);
                    setResumeSuccess(null);
                    setResumeUploading(true);
                    try {
                      const publicUrl = await handleResumeUpload(resumeFile);
                      setResumeSuccess('Resume berhasil diunggah dan sekarang tersedia untuk diunduh.');
                      setCurrentResumeUrl(publicUrl);
                      setResumeFile(null);
                      await triggerRevalidation();
                    } catch (err) {
                      setResumeError(err instanceof Error ? err.message : 'Gagal mengunggah resume.');
                    } finally {
                      setResumeUploading(false);
                    }
                  }}
                  disabled={resumeUploading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-600/40 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {resumeUploading ? 'Mengunggah...' : 'Unggah Resume PDF'}
                </button>
                <p className="text-xs text-zinc-500">File akan diunggah ke bucket Supabase <strong>resume</strong> dengan nama <code>resume.pdf</code>.</p>
              </div>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl">
              <h3 className="text-base font-semibold text-white mb-3">Status Resume Saat Ini</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Di sini Anda bisa melihat apakah resume sudah tersedia dan langsung mengunduhnya.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-zinc-900/70 p-4">
                  <span className="text-sm text-zinc-300">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentResumeUrl ? 'bg-emerald-600/15 text-emerald-300' : 'bg-red-600/10 text-red-300'}`}>
                    {currentResumeUrl ? 'Aktif' : 'Tidak tersedia'}
                  </span>
                </div>
                <div className="rounded-lg bg-zinc-900/70 p-4 text-sm text-zinc-400">
                  <p className="font-medium text-white mb-2">Link Unduhan:</p>
                  <p className="truncate">{currentResumeUrl ?? 'Belum ada resume terunggah.'}</p>
                </div>
              </div>
            </div>
          </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Project Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Tambah Proyek Baru</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError(null);
                    setFormSuccess(null);
                  }}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {formError && (
                <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-3 text-red-400">
                  <WarningIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-200 text-sm">Input Tidak Valid</h4>
                    <p className="text-xs text-red-400/90 mt-1">{formError}</p>
                  </div>
                </div>
              )}

              {formSuccess && (
                <div className="p-4 bg-green-950/40 border border-green-800/60 rounded-lg flex items-start gap-3 text-green-400">
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-200 text-sm">Berhasil disimpan</h4>
                    <p className="text-xs text-green-400/90 mt-1">{formSuccess}</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Judul Proyek</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Nama platform atau aplikasi"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Tech Stack (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.tech_stack}
                    onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                    required
                    placeholder="Next.js, Tailwind CSS, PostgreSQL"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Deskripsi Ringkas</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Jelaskan fitur utama, peran Anda, dan hasil pencapaian teknis proyek ini."
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Thumbnail Proyek
                </label>
                <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    required
                    className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500 transition-colors"
                  />
                  {(uploading || formLoading) && <SVGSpinner size={24} />}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Tautan Live Demo</label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Tautan Repository GitHub</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/santetgan123-ui/repo"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={formLoading || uploading}
                  className="flex-1 px-8 py-4 bg-green-600 hover:bg-green-500 disabled:bg-green-600/40 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-3 text-base"
                >
                  {(formLoading || uploading) && <SVGSpinner size={20} />}
                  <span>Simpan Proyek</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError(null);
                    setFormSuccess(null);
                  }}
                  className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-lg transition-colors text-base"
                >
                  Batal
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
        )}

        {/* Existing Projects Grid */}
        <h2 className="text-xl font-bold text-white mb-6">Daftar Proyek Saat Ini ({projects.length})</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            <InfoIcon className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 text-sm">Belum ada proyek yang terdaftar. Mulai tambahkan proyek pertama Anda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-zinc-900/70 rounded-xl overflow-hidden border border-zinc-800 flex flex-col hover:border-zinc-700 transition-colors"
              >
                <div className="aspect-video w-full relative bg-zinc-950">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <WarningIcon className="w-8 h-8 text-zinc-700" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-zinc-400 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech_stack?.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-zinc-950 text-zinc-400 text-[10px] rounded font-mono uppercase tracking-wider">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 border-t border-zinc-800/80 pt-4 mt-auto">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded transition-colors text-xs"
                      >
                        <ExternalLinkIcon className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </a>
                    )}
                    
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded transition-colors text-xs"
                      >
                        <GitHubIcon className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Apakah Anda yakin ingin menghapus proyek "${project.title}"?`)) {
                          handleDelete(project.id, project.image_url);
                        }
                      }}
                      disabled={deleting === project.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/40 rounded transition-colors text-xs ml-auto disabled:opacity-50"
                    >
                      {deleting === project.id ? (
                        <SVGSpinner size={14} />
                      ) : (
                        <TrashIcon className="w-3.5 h-3.5" />
                      )}
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
