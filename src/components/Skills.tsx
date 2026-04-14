import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Code2, 
  Brain, 
  Workflow,
  Users,
  Wrench
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Skill {
  name: string;
  sources?: string;
}

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  color: string;
  skills: Skill[];
}

const defaultSkillCategories: SkillCategory[] = [
  {
    title: 'Industry Knowledge',
    icon: Brain,
    color: '#8b5cf6',
    skills: [
      { name: 'Debugging', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Automation', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Workflow Management', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Web Scraping', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Computer Science', sources: 'Data Engineer, Software Engineer, B.P. Poddar' },
      { name: 'Design', sources: 'PwC Switzerland' },
      { name: 'Data Analysis', sources: 'Data Engineer, Software Engineer, Accenture' },
      { name: 'Machine Learning', sources: 'B.P. Poddar, British Airways, Cutshort' },
      { name: 'Research Skills', sources: 'Data Engineer, Software Engineer, B.P. Poddar' },
      { name: 'Project Management', sources: 'Data Engineer, B.P. Poddar, Accenture' },
      { name: 'Engineering', sources: 'Data Engineer, Software Engineer, B.P. Poddar, Accenture, J.P. Morgan, PwC' },
    ]
  },
  {
    title: 'Tools & Technologies',
    icon: Wrench,
    color: '#3b82f6',
    skills: [
      { name: 'WordPress', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'PostgreSQL', sources: 'Data Engineer, Software Engineer, B.P. Poddar' },
      { name: 'Microsoft Power BI', sources: 'Data Engineer, Software Engineer, PwC' },
      { name: 'Tableau', sources: 'Data Engineer, Software Engineer, PwC' },
      { name: 'Selenium', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Beautiful Soup', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Python', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Pandas', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Tkinter', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Microsoft PowerPoint', sources: 'B.P. Poddar, M.D.B.D.A.V, Accenture' },
      { name: 'Microsoft Excel', sources: 'Data Engineer, Software Engineer, Accenture, PwC' },
      { name: 'n8n', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
    ]
  },
  {
    title: 'Interpersonal Skills',
    icon: Users,
    color: '#10b981',
    skills: [
      { name: 'Teamwork', sources: 'Data Engineer, B.P. Poddar' },
      { name: 'Leadership', sources: 'Data Engineer, B.P. Poddar, M.D.B.D.A.V' },
      { name: 'Problem Solving', sources: 'Data Engineer, B.P. Poddar, Accenture' },
      { name: 'Communication', sources: 'Data Engineer, Software Engineer, B.P. Poddar, M.D.B.D.A.V' },
      { name: 'Analytical Skills', sources: 'Data Engineer, Software Engineer, Accenture' },
    ]
  },
  {
    title: 'Languages',
    icon: Code2,
    color: '#f59e0b',
    skills: [
      { name: 'English', sources: 'B.P. Poddar, M.D.B.D.A.V' },
      { name: 'Bengali', sources: 'M.D.B.D.A.V' },
      { name: 'Hindi', sources: 'B.P. Poddar, M.D.B.D.A.V' },
    ]
  },
];

function SkillCard({ category, index }: { category: SkillCategory; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = category.icon;
  const { theme } = useTheme();

  // Theme-aware tooltip colors
  const tooltipStyles = theme === 'dark' 
    ? {
        bg: 'bg-slate-800/95 backdrop-blur-md border border-slate-600',
        text: 'text-white',
        arrow: 'border-t-slate-800'
      }
    : {
        bg: 'bg-gray-900/95 backdrop-blur-md border border-gray-700',
        text: 'text-gray-100',
        arrow: 'border-t-gray-900'
      };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass rounded-2xl p-6 h-full card-hover">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${category.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: category.color }} />
          </div>
          <h3 className="text-xl font-bold">{category.title}</h3>
        </div>

        {/* Skills Grid */}
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill, skillIndex) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 + skillIndex * 0.05 }}
              className="relative group/skill"
            >
              <span
                className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-default"
                style={{
                  background: `${category.color}15`,
                  color: category.color,
                  border: `1px solid ${category.color}30`,
                }}
              >
                {skill.name}
              </span>

              {/* Tooltip */}
              {skill.sources && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 invisible group-hover/skill:opacity-100 group-hover/skill:visible transition-all duration-300 z-50 pointer-events-none">
                  <div className={`${tooltipStyles.bg} px-4 py-2 rounded-lg text-xs whitespace-nowrap`}>
                    <div className={tooltipStyles.text}>{skill.sources}</div>
                  </div>
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent" 
                    style={{ 
                      borderTopColor: theme === 'dark' ? 'rgb(30,41,59)' : 'rgb(17,24,39)'
                    }} 
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(defaultSkillCategories);

  useEffect(() => {
    fetchAndMergeSkills();
    
    // Set up visibility listener to refresh when user returns to the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAndMergeSkills();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also set up a refresh interval (every 30 seconds)
    const refreshInterval = setInterval(fetchAndMergeSkills, 30000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchAndMergeSkills = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/skills`);
      if (response.ok) {
        const dbSkills = await response.json();
        
        // Create a copy of default categories
        const merged = defaultSkillCategories.map(category => ({
          ...category,
          skills: [...category.skills]
        }));

        // Group database skills by category
        const skillsByCategory: { [key: string]: Skill[] } = {};
        dbSkills.forEach((skill: any) => {
          if (!skillsByCategory[skill.category]) {
            skillsByCategory[skill.category] = [];
          }
          skillsByCategory[skill.category].push({
            name: skill.name,
            sources: skill.sources
          });
        });

        // Add database skills to matching categories
        merged.forEach(category => {
          if (skillsByCategory[category.title]) {
            category.skills = [...category.skills, ...skillsByCategory[category.title]];
            // Remove duplicates
            const seen = new Set();
            category.skills = category.skills.filter(skill => {
              if (seen.has(skill.name)) return false;
              seen.add(skill.name);
              return true;
            });
          }
        });

        // Add any new categories from database
        Object.keys(skillsByCategory).forEach(categoryName => {
          if (!merged.find(c => c.title === categoryName)) {
            const icon = Wrench; // Default icon for new categories
            merged.push({
              title: categoryName,
              icon,
              color: '#8b5cf6',
              skills: skillsByCategory[categoryName]
            });
          }
        });

        setSkillCategories(merged);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4"
          >
            <Workflow className="w-4 h-4 text-violet-500" />
            <span className="text-sm text-violet-500 font-medium">Expertise</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive set of skills developed through education, professional experience, 
            and continuous learning in data engineering and software development.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
