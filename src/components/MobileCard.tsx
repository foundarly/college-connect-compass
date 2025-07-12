
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface MobileCardProps {
  title: string;
  subtitle?: string;
  location?: string;
  status: string;
  contact?: {
    person?: string;
    phone?: string;
    email?: string;
  };
  dates?: {
    lastContact?: string;
    nextFollowup?: string;
  };
  badges?: string[];
  onClick?: () => void;
  actions?: React.ReactNode;
}

const MobileCard = ({ 
  title, 
  subtitle, 
  location, 
  status, 
  contact, 
  dates, 
  badges = [], 
  onClick,
  actions
}: MobileCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'in-discussion':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'low':
        return <Clock className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-discussion':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md border-l-4 border-l-blue-500 bg-white/90 backdrop-blur-sm ${
        onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span className="capitalize">{status.replace('_', ' ').replace('-', ' ')}</span>
            </div>
            {actions && (
              <div className="flex items-center">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {/* Contact Info */}
        {contact && (
          <div className="space-y-1">
            {contact.person && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{contact.person}</span>
              </div>
            )}
            <div className="flex items-center gap-4">
              {contact.phone && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        {dates && (
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {dates.lastContact && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Last: {dates.lastContact}</span>
              </div>
            )}
            {dates.nextFollowup && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Next: {dates.nextFollowup}</span>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {badges.slice(0, 3).map((badge, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200"
              >
                {badge}
              </Badge>
            ))}
            {badges.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{badges.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileCard;
