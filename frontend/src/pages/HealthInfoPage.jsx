import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Heart, Brain, Apple, Dumbbell, Shield, ChevronRight, X, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageTransition, ScrollReveal, StaggerReveal, staggerItem } from '../components/AnimationWrappers';
import { SkeletonCard } from '../components/LoadingSpinner';
import api from '../utils/api';

const categories = [
  { id: 'all', label: 'All', icon: BookOpen, color: 'sky' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'orange' },
  { id: 'mental-health', label: 'Mental Health', icon: Brain, color: 'purple' },
  { id: 'diet', label: 'Diet & Nutrition', icon: Apple, color: 'green' },
  { id: 'preventive', label: 'Preventive Care', icon: Shield, color: 'teal' },
  { id: 'heart', label: 'Heart Health', icon: Heart, color: 'red' },
];

const colorMap = {
  sky:    'from-sky-500 to-blue-600',
  orange: 'from-orange-500 to-amber-500',
  purple: 'from-purple-500 to-violet-600',
  green:  'from-green-500 to-teal-500',
  teal:   'from-teal-500 to-cyan-600',
  red:    'from-red-500 to-rose-600',
};

// Fallback static articles if backend unavailable
const staticArticles = [
  { _id:'1', title:'10 Morning Habits for Better Health', category:'fitness', readTime:'5 min', summary:'Start your day with these science-backed habits to boost energy, focus, and overall wellness.', tags:['Habits','Morning','Energy'] },
  { _id:'2', title:'Managing Stress with Mindfulness', category:'mental-health', readTime:'7 min', summary:'Learn practical mindfulness techniques to reduce anxiety and cultivate daily mental calm.', tags:['Stress','Mindfulness','Anxiety'] },
  { _id:'3', title:'The Anti-Inflammatory Diet Guide', category:'diet', readTime:'8 min', summary:'Discover which foods fight chronic inflammation and how to build a balanced diet for longevity.', tags:['Diet','Inflammation','Nutrition'] },
  { _id:'4', title:'Heart Health: Know Your Numbers', category:'heart', readTime:'6 min', summary:'Understand blood pressure, cholesterol, and heart rate metrics and what they mean for you.', tags:['Heart','Blood Pressure','Cholesterol'] },
  { _id:'5', title:'Vaccines Every Adult Needs', category:'preventive', readTime:'4 min', summary:'Stay up-to-date with essential adult vaccinations recommended by health authorities.', tags:['Vaccines','Prevention','Immunity'] },
  { _id:'6', title:'Sleep Hygiene: 12 Evidence-Based Tips', category:'mental-health', readTime:'6 min', summary:'Improve your sleep quality with these proven strategies from sleep science research.', tags:['Sleep','Rest','Wellbeing'] },
  { _id:'7', title:'HIIT vs Cardio: Which is Better?', category:'fitness', readTime:'5 min', summary:'Compare high-intensity interval training and steady-state cardio for fat loss and endurance.', tags:['HIIT','Cardio','Exercise'] },
  { _id:'8', title:'Gut Health and Your Immune System', category:'diet', readTime:'9 min', summary:'Explore the gut-brain axis and why a healthy microbiome is key to overall immunity.', tags:['Gut','Probiotics','Immunity'] },
  { _id:'9', title:'Preventive Cancer Screenings by Age', category:'preventive', readTime:'7 min', summary:'A comprehensive guide to recommended cancer screenings for different age groups.', tags:['Cancer','Screening','Prevention'] },
];

export default function HealthInfoPage() {
  const { isDark } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await api.get('/healthinfo');
        setArticles(data.length ? data : staticArticles);
      } catch {
        setArticles(staticArticles);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filtered = articles.filter((a) => {
    const matchesCat = category === 'all' || a.category === category;
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCatMeta = (id) => categories.find((c) => c.id === id) || categories[0];

  return (
    <PageTransition>
      <div className={`min-h-screen pt-20 pb-10 px-4 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal className="text-center mb-10">
            <span className="text-sm font-semibold text-teal-400 tracking-widest uppercase">Health Library</span>
            <h1 className={`font-display text-4xl font-bold mt-3 mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Health <span className="gradient-text">Information Hub</span>
            </h1>
            <p className={`max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Explore curated articles on fitness, mental health, nutrition, and preventive care.
            </p>
          </ScrollReveal>

          {/* Search bar */}
          <ScrollReveal delay={0.1} className="mb-6">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, topics, treatments…"
                className={`input-dark pl-12 pr-4 py-3 rounded-2xl text-base ${isDark ? '' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm'}`}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* Category filter */}
          <ScrollReveal delay={0.15} className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  category === id
                    ? `bg-gradient-to-r ${colorMap[color]} text-white border-transparent shadow-md`
                    : isDark ? 'glass border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </ScrollReveal>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{filtered.length} articles found</p>
              <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((article) => {
                  const cat = getCatMeta(article.category);
                  const CatIcon = cat.icon;
                  return (
                    <motion.div
                      key={article._id}
                      variants={staggerItem}
                      whileHover={{ y: -6, scale: 1.02 }}
                      onClick={() => setSelected(article)}
                      className={`rounded-2xl p-5 border cursor-pointer group transition-all ${isDark ? 'glass border-white/5 hover:border-teal-500/30' : 'bg-white border-slate-200 hover:border-teal-400 shadow-sm hover:shadow-md'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[cat.color]} flex items-center justify-center mb-4`}>
                        <CatIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                          {article.category?.replace('-', ' ')}
                        </span>
                        {article.readTime && (
                          <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <Clock className="w-3 h-3" />{article.readTime}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-semibold mb-2 leading-snug group-hover:text-teal-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {article.title}
                      </h3>
                      <p className={`text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {article.summary}
                      </p>
                      <div className={`flex items-center gap-1 mt-4 text-teal-400 text-sm font-medium`}>
                        Read article <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </StaggerReveal>
              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No articles match your search. Try different keywords.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-2xl rounded-3xl p-8 max-h-[85vh] overflow-y-auto ${isDark ? 'glass' : 'bg-white'}`}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className={`text-xs px-3 py-1 rounded-full capitalize mb-3 inline-block ${isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600 border border-teal-200'}`}>
                  {selected.category?.replace('-', ' ')}
                </span>
                <h2 className={`font-display text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className={`p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 ${isDark ? '' : 'hover:bg-slate-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className={`leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{selected.summary}</p>
            {selected.content && <p className={`leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selected.content}</p>}
            {selected.tags && (
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span key={tag} className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
