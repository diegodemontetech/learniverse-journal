import Layout from '@/components/Layout';

const FeaturedCourse = () => (
  <div className="relative h-[70vh] w-full rounded-xl overflow-hidden mb-12">
    <img
      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
      alt="Featured Course"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-i2know-body via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 p-8">
      <span className="text-i2know-accent font-bold mb-2 inline-block">FEATURED COURSE</span>
      <h1 className="text-4xl font-bold mb-4">Introduction to Programming</h1>
      <p className="text-i2know-text-secondary max-w-2xl mb-6">
        Start your journey into the world of programming with this comprehensive course.
        Learn the fundamentals of coding and build your first applications.
      </p>
      <button className="bg-i2know-accent text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors">
        Start Learning
      </button>
    </div>
  </div>
);

const CourseCard = ({ title, instructor, image }: { title: string; instructor: string; image: string }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
    </div>
    <h3 className="font-bold mb-1">{title}</h3>
    <p className="text-i2know-text-secondary text-sm">{instructor}</p>
  </div>
);

const Index = () => {
  const latestCourses = [
    {
      title: "Web Development Fundamentals",
      instructor: "John Doe",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    },
    {
      title: "Data Science Essentials",
      instructor: "Jane Smith",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
    },
    {
      title: "Mobile App Development",
      instructor: "Mike Johnson",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    },
    {
      title: "UI/UX Design Principles",
      instructor: "Sarah Wilson",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    },
  ];

  return (
    <Layout>
      <FeaturedCourse />
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestCourses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;