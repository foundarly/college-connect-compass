
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setDismissed(true);
    }
  };

  return (
    <>
      {/* Mobile Install Banner */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6" />
            <div>
              <p className="font-semibold text-sm">Install CRM Dashboard</p>
              <p className="text-xs opacity-90">Quick access from your home screen</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleInstall}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Download className="w-4 h-4 mr-1" />
              Install
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed(true)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Install Card */}
      <Card className="hidden lg:block fixed bottom-4 right-4 z-50 w-80 shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Install CRM Dashboard
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Get quick access and work offline with our Progressive Web App
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Install App
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDismissed(true)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
          
          {!isOnline && (
            <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                You're offline. Install the app to access cached content.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PWAInstallPrompt;
