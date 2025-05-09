export default function PageSection({children}: { children: React.ReactNode }) {
    return (
        <section className="max-w-6xl mx-auto px-4 py-6">{children}</section>
    );
}