
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, Phone, Mail, Users, Calendar } from 'lucide-react';

interface MobileCardProps {
  title: string;
  subtitle?: string;
  status?: string;
  location?: string;
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
  status, 
  location, 
  contact, 
  dates, 
  badges = [], 
  onClick,
  actions 
}: MobileCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-discussion': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
            )}
            {location && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>
          {status && (
            <Badge className={`${getStatusColor(status)} border text-xs`}>
              {status.replace('-', ' ')}
            </Badge>
          )}
        </div>

        {/* Contact Info */}
        {contact && (
          <div className="space-y-1">
            {contact.person && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{contact.person}</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {contact.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        {dates && (dates.lastContact || dates.nextFollowup) && (
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            {dates.lastContact && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Last: {dates.lastContact}</span>
              </div>
            )}
            {dates.nextFollowup && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className={new Date(dates.nextFollowup) <= new Date(Date.now() + 7*24*60*60*1000) ? 'text-orange-600 font-medium' : ''}>
                  Next: {dates.nextFollowup}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        {(onClick || actions) && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {actions || <div />}
            {onClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClick}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MobileCard;
