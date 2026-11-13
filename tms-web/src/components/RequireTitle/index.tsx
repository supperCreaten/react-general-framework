export default function RequireTitle(props: { title: string }) {
  const { title } = props
  return (
    <div className="before:mr-1 before:inline-block before:font-[SimSun,sans-serif] before:leading-none before:text-[#ff4d4f] before:content-['*']">
      {title}
    </div>
  )
}
