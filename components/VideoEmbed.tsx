interface VideoEmbedProps {
  url: string
  title: string
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2]?.length === 11 ? match[2] : null
}

function getVimeoId(url: string): string | null {
  const regExp = /vimeo\.com\/(\d+)/
  const match = url.match(regExp)
  return match ? match[1] ?? null : null
}

export default function VideoEmbed({ url, title }: VideoEmbedProps) {
  const youtubeId = getYouTubeId(url)
  const vimeoId = getVimeoId(url)

  if (youtubeId) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy-900">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy-900">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  // Fallback for direct video URLs
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy-900">
      <video
        src={url}
        controls
        className="absolute inset-0 w-full h-full"
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}