import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Building2 } from 'lucide-react';

interface ExperienceItem {
  id?: number;
  company: string;
  role: string;
  type: string;
  location: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  description: string | string[];
  skills: string | string[];
}

const defaultExperiences: ExperienceItem[] = [
  {
    company: 'Capsule Labs',
    role: 'Data Engineer',
    type: 'Full-time',
    location: 'Kolkata, West Bengal, India',
    duration: 'Jul 2025 - Present (1 yr 2 mos)',
    description: [
      'Built and optimized large-scale data pipelines for web scraping, extraction, transformation, and ingestion',
      'Developed automated data collection and workflows using n8n, Make, and custom automation scripts',
      'Designed and managed scalable scraping and data ingestion processes to efficiently collect and process large volumes of data',
      'Automated repetitive data workflows and pipeline operations, improving efficiency and reducing manual effort',

    ],
    skills: ['Selenium', 'Python', 'PostgreSQL', 'n8n', 'Data Analysis']
  },
  {
    company: 'Capsule Labs',
    role: 'Software Engineer',
    type: 'Internship',
    location: 'Kolkata, West Bengal, India',
    duration: 'Sep 2024 - Jul 2025 (11 mos)',
    description: [
      'Developed and optimized Python-based automation scripts for core data processing tasks',
      'Spearheaded end-to-end data preparation for ML models',
      'Successfully executed data extraction and data ingestion across various source systems',
      'Contributed to qualitative research projects by leading aggregation of complex information'
    ],
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Automation', 'Research']
  }
];

function ExperienceCard({ experience, index }: { experience: ExperienceItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const descriptionArray = Array.isArray(experience.description)
    ? experience.description
    : experience.description?.split('\n').filter(Boolean) || [];

  const skillsArray = Array.isArray(experience.skills)
    ? experience.skills
    : JSON.parse(experience.skills || '[]');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      <div className="rounded-2xl p-6 md:p-8 card-hover border border-border bg-card/90 shadow-sm backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">{experience.role}</h3>
                <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">{experience.company}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-foreground/80 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-sky-500" />
              {experience.type}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-foreground/80 font-medium max-w-full">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span className="truncate">{experience.location}</span>
            </span>
          </div>
        </div>

        {/* Duration */}
        {experience.duration && (
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            <span>{experience.duration}</span>
          </div>
        )}

        {/* Description */}
        {descriptionArray.length > 0 && (
          <ul className="space-y-2.5 mb-6">
            {descriptionArray.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: index * 0.15 + i * 0.05 }}
                className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        )}

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
            {skillsArray.map((skill: string) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Timeline connector */}
      {index < (defaultExperiences.length - 1) && (
        <div className="hidden sm:block absolute left-9 top-full w-0.5 h-6 bg-sky-500/20 origin-top" />
      )}
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences);

  useEffect(() => {
    fetchAndMergeExperience();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAndMergeExperience();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const refreshInterval = setInterval(fetchAndMergeExperience, 30000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchAndMergeExperience = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/experience`);
      if (response.ok) {
        const dbExperience = await response.json();
        const merged = [...defaultExperiences, ...dbExperience];
        setExperiences(merged);
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    }
  };

  return (
    <section id="experience" className="py-20 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-medium tracking-wide">Career Track</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-foreground">
            Work <span className="gradient-brand">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Professional journey building scalable ETL pipelines, automation architectures, and cloud data systems.
          </p>
        </motion.div>

        {/* Experience Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <ExperienceCard key={`${exp.company}-${exp.role}`} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
