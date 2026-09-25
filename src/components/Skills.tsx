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
    title: 'Core Disciplines',
    icon: Brain,
    color: '#4f46e5',
    skills: [
      { name: 'Data Pipelines', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Automation', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Workflow Management', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Web Scraping', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Data Analysis', sources: 'Data Engineer, Software Engineer, Accenture' },
      { name: 'Machine Learning', sources: 'B.P. Poddar, British Airways, Cutshort' },
      { name: 'Debugging & Profiling', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Computer Science', sources: 'Data Engineer, Software Engineer, B.P. Poddar' },
      { name: 'Project Management', sources: 'Data Engineer, B.P. Poddar, Accenture' },
      { name: 'Engineering Design', sources: 'Data Engineer, Software Engineer, PwC' },
    ]
  },
  {
    title: 'Tools & Frameworks',
    icon: Wrench,
    color: '#0284c7',
    skills: [
      { name: 'Python', sources: 'Data Engineer at Capsule Labs' },
      { name: 'PostgreSQL', sources: 'Data Engineer, Software Engineer, B.P. Poddar' },
      { name: 'Pandas', sources: 'Data Engineer at Capsule Labs' },
      { name: 'n8n Workflows', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'AWS Cloud', sources: 'Data Engineer at Capsule Labs' },
      { name: 'REST APIs', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Selenium', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Beautiful Soup', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Git & GitHub', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Power BI', sources: 'Data Engineer, Software Engineer, PwC' },
      { name: 'Tableau', sources: 'Data Engineer, Software Engineer, PwC' },
      { name: 'Docker / Linux', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Excel / SQL Queries', sources: 'Data Engineer, Software Engineer, Accenture, PwC' },
    ]
  },
  {
    title: 'Engineering Practices',
    icon: Users,
    color: '#059669',
    skills: [
      { name: 'System Architecture', sources: 'Data Engineer at Capsule Labs' },
      { name: 'Problem Solving', sources: 'Data Engineer, B.P. Poddar, Accenture' },
      { name: 'Code Reviews', sources: 'Data Engineer, Software Engineer at Capsule Labs' },
      { name: 'Technical Documentation', sources: 'Data Engineer, B.P. Poddar' },
      { name: 'Cross-functional Collaboration', sources: 'Data Engineer, B.P. Poddar' },
      { name: 'Analytical Thinking', sources: 'Data Engineer, Software Engineer, Accenture' },
    ]
  },
  {
    title: 'Languages & Communication',
    icon: Code2,
    color: '#d97706',
    skills: [
      { name: 'English (Fluent)', sources: 'B.P. Poddar, M.D.B.D.A.V' },
      { name: 'Bengali (Native)', sources: 'M.D.B.D.A.V' },
      { name: 'Hindi (Proficient)', sources: 'B.P. Poddar, M.D.B.D.A.V' },
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
      bg: 'bg-zinc-900 border border-zinc-700/80 shadow-lg',
      text: 'text-zinc-100',
      arrow: 'border-t-zinc-900'
    }
    : {
      bg: 'bg-zinc-900 border border-zinc-800 shadow-lg',
      text: 'text-zinc-100',
      arrow: 'border-t-zinc-900'
    };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="glass rounded-2xl p-5 sm:p-6 h-full card-hover border border-border/70 bg-card/40">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center border"
            style={{
              background: `${category.color}15`,
              borderColor: `${category.color}30`
            }}
          >
            <Icon className="w-5 h-5" style={{ color: category.color }} />
          </div>
          <h3 className="text-lg font-bold text-foreground">{category.title}</h3>
        </div>

        {/* Skills Grid */}
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill, skillIndex) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: index * 0.08 + skillIndex * 0.03 }}
              className="relative group/skill"
            >
              <span
                className="inline-block px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-default border"
                style={{
                  background: `${category.color}0D`,
                  color: category.color,
                  borderColor: `${category.color}25`,
                }}
              >
                {skill.name}
              </span>

              {/* Tooltip */}
              {skill.sources && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover/skill:opacity-100 group-hover/skill:visible transition-all duration-200 z-50 pointer-events-none">
                  <div className={`${tooltipStyles.bg} px-3 py-1.5 rounded-md text-[11px] font-mono whitespace-nowrap`}>
                    <div className={tooltipStyles.text}>{skill.sources}</div>
                  </div>
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-zinc-900"
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/skills`);
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
              color: '#0284c7',
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
    <section id="skills" className="py-20 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border/80 mb-3.5">
            <Workflow className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-mono font-medium text-foreground tracking-wide">Technical Stack</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-foreground">
            Skills & Core Competencies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Technical proficiencies across data engineering, pipeline design, automated workflows, and backend development.
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
