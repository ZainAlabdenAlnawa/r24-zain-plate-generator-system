
import React from 'react';
import { usePlates } from './hooks/usePlates';
import PlateVisualizer from './components/PlateVisualizer';
import PlateControls from './components/PlateControls';
import { MOTIF_IMAGE_URL, MOTIF_BASE_WIDTH } from './constants';

const App: React.FC = () => {
  const {
    plates,
    addPlate,
    removePlate,
    updatePlateDimension,
    reorderPlates,
    isLoading,
    unit,
    setUnit,
    motifUrl,
    setMotifUrl,
  } = usePlates();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          setMotifUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Could not load image. Please try another file.");
      }
    }
  };
  
  const handleExportToPng = async () => {
    const image = new Image();

    const proceedWithRender = () => {
        const totalWidth = plates.reduce((sum, p) => sum + p.width, 0);
        const maxHeight = Math.max(...plates.map(p => p.height), 0);

        if (!totalWidth || !maxHeight) {
            alert("Cannot export an empty design.");
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = totalWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            alert("Could not create canvas for export.");
            return;
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, totalWidth, maxHeight);

        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = totalWidth > MOTIF_BASE_WIDTH ? Math.ceil(totalWidth / MOTIF_BASE_WIDTH) * MOTIF_BASE_WIDTH : MOTIF_BASE_WIDTH;
        bgCanvas.height = maxHeight;
        const bgCtx = bgCanvas.getContext('2d');
        if (!bgCtx) return;

        const imgW = image.naturalWidth;
        const imgH = image.naturalHeight;
        const tileW = MOTIF_BASE_WIDTH;
        const numTiles = Math.ceil(bgCanvas.width / tileW);
        
        for (let i = 0; i < numTiles; i++) {
            bgCtx.save();
            if (i % 2 !== 0) {
                bgCtx.translate(tileW * (i + 1), 0);
                bgCtx.scale(-1, 1);
            } else {
                bgCtx.translate(tileW * i, 0);
            }
            const imgRatio = imgW / imgH;
            const tileRatio = tileW / maxHeight;
            let sx=0, sy=0, sWidth=imgW, sHeight=imgH;
            if (imgRatio > tileRatio) {
                sWidth = imgH * tileRatio;
                sx = (imgW - sWidth) / 2;
            } else {
                sHeight = imgW / tileRatio;
                sy = (imgH - sHeight) / 2;
            }
            bgCtx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, tileW, maxHeight);
            bgCtx.restore();
        }

        let accumulatedWidth = 0;
        plates.forEach(plate => {
            const sx = accumulatedWidth;
            const sy = (maxHeight - plate.height) / 2;
            const sWidth = plate.width;
            const sHeight = plate.height;
            
            ctx.drawImage(bgCanvas, sx, 0, sWidth, maxHeight, sx, 0, sWidth, maxHeight);
            
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.lineWidth = 1;
            ctx.strokeRect(sx, sy, sWidth, sHeight);
            
            accumulatedWidth += plate.width;
        });

        // Clear areas outside the plates
        ctx.fillStyle = '#ffffff';
        accumulatedWidth = 0;
        plates.forEach(plate => {
          const plateY = (maxHeight - plate.height) / 2;
          ctx.fillRect(accumulatedWidth, 0, plate.width, plateY);
          ctx.fillRect(accumulatedWidth, plateY + plate.height, plate.width, maxHeight - (plateY + plate.height));
          accumulatedWidth += plate.width;
        });


        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'plate-design.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    image.onload = () => {
        proceedWithRender();
        if (image.src.startsWith('blob:')) {
            URL.revokeObjectURL(image.src);
        }
    };
    image.onerror = () => {
        if (image.src.startsWith('blob:')) {
            URL.revokeObjectURL(image.src);
        }
        alert("Could not load the motif image for export.");
    };

    if (motifUrl.startsWith('data:')) {
        image.src = motifUrl;
    } else {
        try {
            const response = await fetch(motifUrl);
            if (!response.ok) throw new Error('Network error fetching image');
            const blob = await response.blob();
            image.src = URL.createObjectURL(blob);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Could not load motif image for export. It might be due to network or security issues (CORS). Try uploading the image from your device instead.");
        }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-xl font-semibold text-gray-700">Loading Config...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white font-sans">
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
        <div className="flex-shrink-0 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Plate Generator</h1>
          <p className="text-sm md:text-base text-gray-600">Configure and visualize your custom wall plates.</p>
        </div>
        <PlateVisualizer plates={plates} motifUrl={motifUrl} />
      </main>
      <aside className="w-full md:w-96 lg:w-[420px] bg-gray-50 border-l border-gray-200 shadow-lg p-4 md:p-6 flex flex-col overflow-y-auto">
        <PlateControls
          plates={plates}
          unit={unit}
          onAddPlate={addPlate}
          onRemovePlate={removePlate}
          onUpdatePlateDimension={updatePlateDimension}
          onReorderPlates={reorderPlates}
          onUnitChange={setUnit}
          onTriggerUpload={() => fileInputRef.current?.click()}
          onResetMotif={() => setMotifUrl(MOTIF_IMAGE_URL)}
          onExport={handleExportToPng}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
      </aside>
    </div>
  );
};

export default App;
