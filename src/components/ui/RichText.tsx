interface RichTextProps {
  content: string;
  className?: string;
}

export function RichText({ content, className = '' }: RichTextProps) {
  return (
    <div
      className={[
        'prose prose-sm max-w-none',
        // Headings
        '[&_h1]:font-serif [&_h1]:text-4xl [&_h1]:text-foreground [&_h1]:mb-4',
        '[&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-foreground [&_h2]:mb-3',
        '[&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-foreground [&_h3]:mb-3',
        '[&_h4]:font-sans [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mb-2',
        '[&_h5]:font-sans [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:text-foreground [&_h5]:mb-2',
        '[&_h6]:font-sans [&_h6]:text-base [&_h6]:font-semibold [&_h6]:text-foreground [&_h6]:mb-2',
        // Body
        '[&_p]:font-sans [&_p]:text-foreground [&_p]:leading-relaxed [&_p]:mb-4',
        // Lists
        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4',
        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4',
        '[&_li]:font-sans [&_li]:text-foreground [&_li]:mb-1',
        // Blockquote
        '[&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/70 [&_blockquote]:mb-4',
        // Code
        '[&_code]:font-mono [&_code]:text-sm [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5',
        '[&_pre]:font-mono [&_pre]:text-sm [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:mb-4 [&_pre]:overflow-x-auto',
        // Links
        '[&_a]:text-accent [&_a]:underline [&_a]:hover:no-underline',
        // Strong / em
        '[&_strong]:font-semibold',
        '[&_em]:italic',
        className,
      ].join(' ')}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
