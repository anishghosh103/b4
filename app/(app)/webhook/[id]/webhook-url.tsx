'use client';

import { Check, CheckCircle2, Copy } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export function WebhookUrl({ uniqueId }: { uniqueId: string }) {
  const [copied, setCopied] = useState(false);
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);
  const url = `${process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL}/${uniqueId}`;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      role="button"
      className="group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 active:scale-[0.98] transition-all cursor-pointer"
      onClick={handleCopy}
    >
      <div className="relative">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
        <div className="absolute inset-0 animate-ping">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 opacity-30" />
        </div>
      </div>
      <code className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
        {url}
      </code>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={copied ? '1' : '0'}
          initial={
            isFirstRender.current
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {copied ? (
            <Check className="size-3 text-emerald-600 dark:text-emerald-500" />
          ) : (
            <Copy className="size-3 text-emerald-600 dark:text-emerald-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
