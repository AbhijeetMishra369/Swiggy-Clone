import { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type CarouselProps = {
  children: ReactNode[];
  slidesPerView?: number | { [key: string]: number };
  spaceBetween?: number;
  autoplayMs?: number | false;
  freeMode?: boolean;
  withPagination?: boolean;
  withNavigation?: boolean;
  className?: string;
};

export default function Carousel({
  children,
  slidesPerView = { 0: 1.2, 640: 2.2, 768: 3.2, 1024: 4.2 },
  spaceBetween = 12,
  autoplayMs = 4000,
  freeMode = false,
  withPagination = false,
  withNavigation = true,
  className = '',
}: CarouselProps) {
  const modules = [Navigation, Pagination, Autoplay, FreeMode];
  return (
    <Swiper
      modules={modules}
      slidesPerView={typeof slidesPerView === 'number' ? slidesPerView : undefined}
      breakpoints={typeof slidesPerView === 'number' ? undefined : slidesPerView}
      spaceBetween={spaceBetween}
      autoplay={autoplayMs ? { delay: autoplayMs, disableOnInteraction: false } : false}
      freeMode={freeMode}
      pagination={withPagination ? { clickable: true } : undefined}
      navigation={withNavigation}
      className={className}
    >
      {children.map((child, idx) => (
        <SwiperSlide key={idx}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}

