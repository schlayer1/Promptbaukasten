import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  FolderDown, 
  Gamepad2, 
  FileText, 
  Trash2, 
  Calendar, 
  User, 
  RefreshCw,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import { CloudMaterial } from '../../types/cloud';
import { loadMaterialsFromCloud, deleteMaterialFromCloud } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { ParsedGenerationOutput, GeneratorFormState } from '../../types/generator';

interface CloudLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadMaterial: (material: CloudMaterial) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const CloudLibraryModal: React.FC<CloudLibraryModalProps> = ({
  isOpen,
  onClose,
  onLoadMaterial,
  onShowToast
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [materials, setMaterials] = useState<CloudMaterial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const items = await loadMaterialsFromCloud();
      setMaterials(items);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMaterials();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Möchtest du das Material "${title}" wirklich löschen?`)) return;
    await deleteMaterialFromCloud(id);
    setMaterials(prev => prev.filter(m => m.id !== id));
    onShowToast('Gelöscht', 'Material wurde aus der Cloud entfernt.', 'info');
  };

  // Filter materials
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topicTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubjectFilter === 'all' || m.subjectId === selectedSubjectFilter;
    const matchesGrade = selectedGradeFilter === 'all' || String(m.gradeLevel) === selectedGradeFilter;

    return matchesSearch && matchesSubject && matchesGrade;
  });

  // Extract unique subjects in saved materials
  const subjectsInList = Array.from(new Set(materials.map(m => m.subjectId))).map(id => {
    const item = materials.find(m => m.subjectId === id);
    return { id, name: item?.subjectName || id };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-school-primary px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Schul-Bibliothek (Kollegiums-Fundus)</h3>
              <p className="text-xs text-school-primaryLight">
                Zentral in Firebase gespeicherte Unterrichtsmaterialien & Lernspiele der Heimbürgeschule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMaterials}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
              title="Neu laden"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Suche nach Thema, Fach oder Kollege..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubjectFilter}
              onChange={e => setSelectedSubjectFilter(e.target.value)}
              className="text-xs font-semibold px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-school-primary"
            >
              <option value="all">Alle Fächer</option>
              {subjectsInList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={selectedGradeFilter}
              onChange={e => setSelectedGradeFilter(e.target.value)}
              className="text-xs font-semibold px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-school-primary"
            >
              <option value="all">Alle Klassen</option>
              {[5, 6, 7, 8, 9, 10].map(g => (
                <option key={g} value={String(g)}>Klasse {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTENT LIST */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-school-surface">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-school-primary" />
              Lade Unterrichtsmaterialien aus der Firebase Cloud...
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200 p-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">Noch keine Materialien vorhanden</p>
              <p className="mt-1">
                Erstelle im Baukasten eine Unterrichtseinheit und klicke auf <strong>"In Schul-Cloud speichern"</strong>, um sie hier für das gesamte Kollegium bereitzustellen!
              </p>
            </div>
          ) : (
            filteredMaterials.map(m => {
              const isOwner = currentUser?.id === m.authorId || isAdmin;
              const formattedDate = new Date(m.createdAt).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });

              return (
                <div
                  key={m.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-soft hover:border-school-primary transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-school-primaryLight text-school-primary">
                        {m.subjectName} • Kl. {m.gradeLevel}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {m.format.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formattedDate}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                        <User className="w-3 h-3 text-school-secondary" /> {m.authorName}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      Thema: {m.topicTitle} {m.customTopicDetail ? `• Fokus: ${m.customTopicDetail}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onLoadMaterial(m);
                        onClose();
                        onShowToast('Geladen', `"${m.title}" wurde in deinen Arbeitsbereich geladen.`, 'success');
                      }}
                      className="px-4 py-2 bg-school-primary text-white text-xs font-bold rounded-xl hover:bg-school-primaryDark transition flex items-center gap-1.5 shadow-sm"
                    >
                      <FolderDown className="w-3.5 h-3.5" />
                      In Baukasten laden
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => handleDelete(m.id, m.title)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                        title="Material löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>{filteredMaterials.length} Unterrichtseinheiten in der Cloud</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
