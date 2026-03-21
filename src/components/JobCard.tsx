import React from 'react';
import { MapPin, Building2, Clock, Euro, Briefcase, ExternalLink, Calendar } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 hover:text-[var(--color-primary)] transition-colors">
            <a href={job.link} target="_blank" rel="noopener noreferrer">
              {job.title}
            </a>
          </h2>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <Building2 className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span className="font-medium">{job.company}</span>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {job.contractType}
            </div>
            {job.salary !== 'Non spécifié' && (
              <div className="flex items-center">
                <Euro className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {job.salary}
              </div>
            )}
            {job.datePost && (
              <div className="flex items-center">
                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {job.datePost}
              </div>
            )}
            {job.date && (
              <div className="flex items-center">
                <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {job.date}
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-800 border border-orange-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="ml-4 flex-shrink-0 flex flex-col items-end">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=48`} 
            alt={job.company} 
            className="h-12 w-12 rounded-lg object-cover border border-gray-100"
          />
          <a 
            href={job.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
          >
            Voir l'offre
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
