import ReactMarkdown from 'react-markdown';

export default function MarkdownText({ children, className = '' }) {
  if (!children) return null;
  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className}`}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
