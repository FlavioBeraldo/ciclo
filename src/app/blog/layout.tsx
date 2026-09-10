import PlaybookPopup from '@/components/PlaybookPopup'

// Layout do blog: envolve a listagem e todos os artigos,
// montando o popup do playbook uma única vez.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PlaybookPopup />
    </>
  )
}
