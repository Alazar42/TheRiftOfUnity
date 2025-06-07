import { useState } from "react";
import { useWorld } from "@/lib/stores/useWorld";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Inventory = () => {
  const { relics } = useWorld();
  const [showInventory, setShowInventory] = useState(false);

  const getRelicIcon = (virtue: string) => {
    const icons: { [key: string]: string } = {
      'Faith': '✨',
      'Compassion': '❤️',
      'Strength': '⛰️',
      'Wisdom': '📚',
      'Truth': '🔍'
    };
    return icons[virtue] || '💎';
  };

  const getRelicColor = (virtue: string) => {
    const colors: { [key: string]: string } = {
      'Faith': 'bg-yellow-500',
      'Compassion': 'bg-red-500',
      'Strength': 'bg-amber-700',
      'Wisdom': 'bg-blue-500',
      'Truth': 'bg-orange-400'
    };
    return colors[virtue] || 'bg-gray-500';
  };

  if (!showInventory) {
    return (
      <div className="fixed top-4 right-4 z-30">
        <Button
          onClick={() => setShowInventory(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Relics ({relics.length}/5)
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-400">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-amber-800 flex items-center justify-center space-x-2">
            <span>💎</span>
            <span>Sacred Relics</span>
            <span>💎</span>
          </CardTitle>
          <p className="text-amber-700">
            Collected: {relics.length} / 5
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {relics.length === 0 ? (
            <div className="text-center py-8 text-amber-700">
              <p className="text-lg">No relics collected yet.</p>
              <p className="text-sm">Complete puzzles in each region to earn sacred relics.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relics.map((relic) => (
                <div
                  key={relic.id}
                  className="border-2 border-amber-300 rounded-lg p-4 bg-white shadow-md"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-12 h-12 rounded-full ${getRelicColor(relic.virtue)} flex items-center justify-center text-white text-xl`}>
                      {getRelicIcon(relic.virtue)}
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800">{relic.name}</h3>
                      <Badge variant="outline" className="text-xs border-amber-400 text-amber-700">
                        {relic.virtue}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{relic.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {relics.length === 5 && (
            <div className="text-center p-4 bg-gradient-to-r from-yellow-200 to-amber-300 rounded-lg border-2 border-yellow-500">
              <h3 className="font-bold text-lg text-yellow-800 mb-2">
                🌟 All Relics Collected! 🌟
              </h3>
              <p className="text-yellow-700">
                You can now perform the Unity Ritual at the Tree of Unity!
              </p>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button 
              onClick={() => setShowInventory(false)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Close Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
