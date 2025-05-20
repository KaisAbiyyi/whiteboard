import { useEffect, type RefObject } from 'react';
import Konva from 'konva';
import jsPDF from 'jspdf';
import { getBoardById } from '../services/boardService';
import { formatTimestamp } from '../lib/utils';

type ExportType = 'image' | 'pdf';

export const useExportHandler = (
    stageRef: RefObject<Konva.Stage | null>,
    boardId: string
) => {
    useEffect(() => {
        const handleExport = async (e: CustomEvent<{ type: ExportType }>) => {
            if (!stageRef.current) return;

            const stage = stageRef.current;

            const whiteBg = new Konva.Rect({
                x: 0,
                y: 0,
                width: stage.width(),
                height: stage.height(),
                fill: 'white',
            });

            const firstLayer = stage.getLayers()[0];
            firstLayer.add(whiteBg);
            whiteBg.moveToBottom();
            stage.draw();

            const dataURL = stage.toDataURL({ pixelRatio: 2 });

            whiteBg.destroy();
            stage.draw();

            let filenamePrefix = 'whiteboard';
            try {
                const res = await getBoardById(boardId);
                if (res.name?.trim()) {
                    filenamePrefix = res.name
                        .trim()
                        .replace(/\s+/g, '_')
                        .replace(/[^a-zA-Z0-9_-]/g, '');
                }
            } catch {
                console.warn('[Export] Failed Retrieving Board Name');
            }

            const filename = `${filenamePrefix}_${formatTimestamp()}.${e.detail.type === 'image' ? 'png' : 'pdf'}`;

            if (e.detail.type === 'image') {
                const link = document.createElement('a');
                link.download = filename;
                link.href = dataURL;
                link.click();
            } else if (e.detail.type === 'pdf') {
                const pdf = new jsPDF('landscape', 'px', [window.innerWidth, window.innerHeight]);
                pdf.addImage(dataURL, 'PNG', 0, 0, window.innerWidth, window.innerHeight);
                pdf.save(filename);
            }
        };

        const wrapper = (e: Event) => {
            handleExport(e as CustomEvent<{ type: ExportType }>);
        };

        document.addEventListener('export-canvas', wrapper);
        return () => {
            document.removeEventListener('export-canvas', wrapper);
        };
    }, [stageRef, boardId]);
};
