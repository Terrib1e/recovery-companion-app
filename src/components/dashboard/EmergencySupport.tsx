import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Phone,
  HeartHandshake,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmergencyContact {
  name: string;
  description: string;
  phone: string;
  available24h: boolean;
  isEmergency?: boolean;
}

interface Resource {
  title: string;
  description: string;
  url?: string;
}

const EmergencySupport: React.FC = () => {
  const [showAllContacts, setShowAllContacts] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    {
      name: "Emergency Services",
      description: "For immediate life-threatening emergencies",
      phone: "911",
      available24h: true,
      isEmergency: true
    },
    {
      name: "988 Suicide & Crisis Lifeline",
      description: "24/7 suicide prevention and crisis support",
      phone: "988",
      available24h: true,
      isEmergency: true
    },
    {
      name: "SAMHSA's National Helpline",
      description: "Treatment referral and information service",
      phone: "1-800-662-4357",
      available24h: true,
      isEmergency: false
    }
  ];

  const resources: Resource[] = [
    {
      title: "Find Local AA Meetings",
      description: "Search for Alcoholics Anonymous meetings in your area",
      url: "https://www.aa.org/find-aa"
    },
    {
      title: "SAMHSA Treatment Locator",
      description: "Find treatment facilities near you",
      url: "https://findtreatment.gov/"
    }
  ];

  const handleCall = (contact: EmergencyContact) => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="border-red-100 dark:border-red-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Emergency Support
        </CardTitle>
        <CardDescription>
          Immediate help and resources available 24/7
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emergency Warning */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>In Immediate Danger?</AlertTitle>
          <AlertDescription>
            If you or someone else is in immediate danger, call emergency services (911) right away.
          </AlertDescription>
        </Alert>

        {/* Primary Emergency Contacts */}
        <div className="space-y-2">
          {emergencyContacts
            .filter(contact => contact.isEmergency || showAllContacts)
            .map((contact, index) => (
              <Button
                key={index}
                variant={contact.isEmergency ? "destructive" : "secondary"}
                className="w-full flex items-center justify-between text-left"
                onClick={() => handleCall(contact)}
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <div>
                    <div className="font-semibold">{contact.name}</div>
                    <div className="text-xs opacity-90">{contact.description}</div>
                  </div>
                </div>
                {contact.available24h && (
                  <span className="text-xs bg-background/10 px-2 py-1 rounded-full">
                    24/7
                  </span>
                )}
              </Button>
            ))}

          {emergencyContacts.length > 2 && (
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setShowAllContacts(!showAllContacts)}
            >
              {showAllContacts ? (
                <span className="flex items-center gap-2">
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" />
                  Show More Resources
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Additional Resources */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <HeartHandshake className="h-4 w-4" />
            Additional Support
          </h3>
          {resources.map((resource, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-between"
              onClick={() => resource.url && handleResourceClick(resource.url)}
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-semibold">{resource.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {resource.description}
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencySupport;