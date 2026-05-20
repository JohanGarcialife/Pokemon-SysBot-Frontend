'use client';

import { useState, useEffect } from 'react';

interface CodeModalProps {
  order: any;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export function CodeModal({ order, onClose, onToast }: CodeModalProps) {
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    // If order has custom expiration
    if (order.expiresIn) {
      setTimeLeft(order.expiresIn);
    } else {
      setTimeLeft(180);
    }
  }, [order]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCopyCode = async () => {
    const code = order.tradeCode || '00000000';
    try {
      await navigator.clipboard.writeText(code);
      onToast('Código copiado.');
    } catch (err) {
      onToast('Error al copiar el código.');
    }
  };

  const code = order.tradeCode || '00000000';
  const displayCode = `${code.slice(0, 4)} ${code.slice(4)}`;
  const displayCodeHtml = (
    <>
      {code.slice(0, 4)}
      <br />
      {code.slice(4)}
    </>
  );

  const m = String(Math.floor(timeLeft / 60));
  const s = String(timeLeft % 60).padStart(2, '0');

  const game = order.game || order.order?.game || order.orders?.[0]?.game || 'sv';
  const gameName = game === 'sv' ? 'Pokémon Escarlata/Púrpura' : 'Pokémon Legends: Z-A';
  const mode = game === 'sv' ? 'Poké Portal → Intercambio con Código' : 'sistema de intercambio del juego';

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="codeTitle">
      <div className="modal-panel code-panel">
        <button className="close code-close" onClick={onClose} type="button" aria-label="Cerrar">×</button>
        <div className="code-top">
          <span className="controller">🎮</span>
          <div>
            <h2 id="codeTitle">CÓDIGO DE INTERCAMBIO</h2>
            <p id="codeSubtitle">
              {order.isBulk
                ? `Tu pedido de ${order.orders?.length || 1} Pokémon está listo.`
                : `Tu ${order.order?.displayName || 'Pokémon'} está listo para el intercambio.`}
            </p>
          </div>
        </div>

        <div id="orderStatus" className="status-box ok">
          {order.discordStatus || 'Orden registrada. Esperando conexión con el bot.'}
        </div>

        <div className="code-box" id="tradeCode">
          {displayCodeHtml}
        </div>

        <div className="expires">
          ⏱ Expira en <span id="timer">{m}:{s}</span>
        </div>

        <button className="copy-code" onClick={handleCopyCode} type="button">
          ⧉ COPIAR CÓDIGO
        </button>

        <div className="instructions">
          <h3>📋 INSTRUCCIONES</h3>
          <ol id="instructionsList">
            <li>Abre <b>{gameName}</b> en tu Nintendo Switch.</li>
            <li>Ve a <b>{mode}</b>.</li>
            <li>Ingresa el código: <b>{displayCode}</b>.</li>
            <li>Espera la conexión y acepta el intercambio.</li>
          </ol>
        </div>

        <p className="small-center">El código expira en {Math.ceil(timeLeft / 60)} minutos. Si expira, genera uno nuevo.</p>
      </div>
    </div>
  );
}
