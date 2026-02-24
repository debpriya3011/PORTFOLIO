import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { GraduationCap, Calendar, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EducationItem {
  id?: number;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  field_of_study?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  skills: string | string[];
}

interface Certification {
  id?: number;
  name: string;
  issuer: string;
  issueDate?: string;
  issue_date?: string;
  expiryDate?: string;
  expiry_date?: string;
  credentialId?: string;
  credential_id?: string;
  credentialUrl?: string;
  credential_url?: string;
  skills: string | string[];
}

const defaultEducation: EducationItem[] = [
  {
    institution: 'B.P. Poddar Institute Of Management and Technology',
    duration: '2021 - 2025',
    skills: ['Communication', 'Hindi', 'Computer Science', 'Machine Learning', 'Microsoft PowerPoint', 'Project Management', 'Engineering', 'PostgreSQL', 'Research Skills', 'Teamwork', 'English', 'Leadership', 'Problem Solving']
  },
  {
    institution: 'M. D. B. D. A. V. Public School',
    degree: 'Higher Secondary',
    fieldOfStudy: 'Science',
    duration: 'Mar 2020 - Mar 2021',
    grade: '94.6%',
    skills: ['Communication', 'Hindi', 'Microsoft PowerPoint', 'Bengali', 'English', 'Leadership']
  },
  {
    institution: 'M. D. B. D. A. V. Public School',
    degree: 'Secondary',
    duration: 'Mar 2018 - Mar 2019',
    grade: '94.6%',
    skills: ['Communication', 'Hindi', 'Microsoft PowerPoint', 'Bengali', 'English', 'Leadership']
  }
];

const defaultCertifications: Certification[] = [
  {
    name: 'Cutshort Certified Machine Learning (ML) - Advanced',
    issuer: 'Cutshort',
    issueDate: 'Oct 2024',
    expiryDate: 'Oct 2025',
    credentialId: '105961',
    credentialUrl: 'https://cutshort.io/certificate/105961',
    skills: ['Machine Learning']
  },
  {
    name: 'British Airways - Data Science Job Simulation',
    issuer: 'Forage',
    issueDate: 'Jul 2024',
    credentialId: 'yb37CE6EroSHwueag',
    credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/British%20Airways/NjynCWzGSaWXQCxSX_British%20Airways_wY4sDTJWALbn2YAst_1722347934217_completion_certificate.pdf',
    skills: ['Machine Learning']
  },
  {
    name: 'PwC Switzerland - Power BI Job Simulation',
    issuer: 'Forage',
    issueDate: 'Jul 2024',
    credentialId: 'yPAZzttR8RSta2jR4',
    credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/PwC%20Switzerland/a87GpgE6tiku7q3gu_PwC%20Switzerland_wY4sDTJWALbn2YAst_1722321454169_completion_certificate.pdf',
    skills: ['Microsoft Power BI', 'Engineering', 'Microsoft Excel', 'Design', 'Tableau']
  },
  {
    name: 'J.P. Morgan - Software Engineering Job Simulation',
    issuer: 'Forage',
    issueDate: 'Jul 2024',
    credentialId: 'L9EcFifTHs8bNMinb',
    credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/J.P.%20Morgan/R5iK7HMxJGBgaSbvk_J.P.%20Morgan_wY4sDTJWALbn2YAst_1722230718479_completion_certificate.pdf',
    skills: ['Engineering']
  },
  {
    name: 'Accenture North America - Data Analytics and Visualization Job Simulation',
    issuer: 'Forage',
    issueDate: 'Jul 2024',
    credentialId: 'bvLA7jhuGRcA8saCc',
    credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Accenture%20North%20America/hzmoNKtzvAzXsEqx8_Accenture%20North%20America_wY4sDTJWALbn2YAst_1722162488539_completion_certificate.pdf',
    skills: ['Engineering', 'Problem Solving', 'Microsoft Excel', 'Analytical Skills', 'Data Analysis', 'Microsoft PowerPoint', 'Project Management']
  }
];

function EducationCard({ item, index }: { item: EducationItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const duration = item.duration || (item.start_date ? `${item.start_date} - ${item.end_date || 'Present'}` : '');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-xl p-5 card-hover"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg mb-1">{item.institution}</h4>
          {(item.degree || item.fieldOfStudy || item.field_of_study) && (
            <p className="text-violet-500 font-medium text-sm">
              {item.degree}{(item.fieldOfStudy || item.field_of_study) && `, ${item.fieldOfStudy || item.field_of_study}`}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            {duration && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {duration}
              </span>
            )}
            {item.grade && (
              <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 text-xs">
                Grade: {item.grade}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CertificationCard({ cert, index }: { cert: Certification; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const skillsArray = Array.isArray(cert.skills) ? cert.skills : JSON.parse(cert.skills || '[]');
  const issueDate = cert.issueDate || cert.issue_date;
  const expiryDate = cert.expiryDate || cert.expiry_date;
  const credentialUrl = cert.credentialUrl || cert.credential_url;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-xl p-5 card-hover"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg mb-1">{cert.name}</h4>
          <p className="text-amber-500 font-medium text-sm">{cert.issuer}</p>
          {issueDate && (
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {issueDate}
                {expiryDate && ` - ${expiryDate}`}
              </span>
            </div>
          )}
          {skillsArray.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {skillsArray.slice(0, 3).map((skill: string) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs"
                >
                  {skill}
                </span>
              ))}
              {skillsArray.length > 3 && (
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                  +{skillsArray.length - 3}
                </span>
              )}
            </div>
          )}
          {credentialUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-xs"
              onClick={() => window.open(credentialUrl, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View Credential
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [education, setEducation] = useState<EducationItem[]>(defaultEducation);
  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications);

  useEffect(() => {
    fetchAndMergeEducation();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAndMergeEducation();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const refreshInterval = setInterval(fetchAndMergeEducation, 30000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchAndMergeEducation = async () => {
    try {
      const [educationRes, certificationsRes] = await Promise.all([
        fetch('http://localhost:3001/api/education'),
        fetch('http://localhost:3001/api/certifications')
      ]);

      if (educationRes.ok) {
        const dbEducation = await educationRes.json();
        setEducation([...defaultEducation, ...dbEducation]);
      }

      if (certificationsRes.ok) {
        const dbCertifications = await certificationsRes.json();
        setCertifications([...defaultCertifications, ...dbCertifications]);
      }
    } catch (error) {
      console.error('Error fetching education data:', error);
    }
  };

  return (
    <section id="education" className="py-24 relative">
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
            <GraduationCap className="w-4 h-4 text-violet-500" />
            <span className="text-sm text-violet-500 font-medium">Background</span>
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-4">
            Education & <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Academic foundation combined with professional certifications from industry leaders.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-violet-500" />
              Education
            </h3>
            <div className="space-y-4">
              {education.map((item, index) => (
                <EducationCard key={item.institution} item={item} index={index} />
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              Certifications
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {certifications.map((cert, index) => (
                <CertificationCard key={cert.name} cert={cert} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
