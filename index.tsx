import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { festivalQuery } from "@/lib/festival-query";
import { Leaderboard, EventList, GalleryGrid, StallRewards } from "@/components/festival-panels";
import { CodeScene } from "@/components/code-scene";
import { Button } from "@/components/ui/button";
import { TeamLogos } from "@/components/festival-shell";
import { useEffect, useRef, useState } from "react";
import { Atom, FlaskConical, Dna, Cpu, ArrowRight, ArrowDown, Trophy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPECTRUM 2026 — Rajaji Vidyalaya Science Festival" },
      { name: "description", content: "SPECTRUM 2026: physics, chemistry, biology and code come alive at the Rajaji Vidyalaya Science Festival." },
      { property: "og:title", content: "SPECTRUM 2026 — Science Festival" },
      { property: "og:description", content: "Experiments, challenges and a live scoreboard at Rajaji Vidyalaya's science festival." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(festivalQuery),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function AtomScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const f = (e: MouseEvent) => setT({ x: (e.clientX / window.innerWidth - 0.5) * 16, y: (e.clientY / window.innerHeight - 0.5) * 16 });
    window.addEventListener("mousemove", f);
    return () => window.removeEventListener("mousemove", f);
  }, []);
  const orbits = [0, 60, 120];
  const colors = ["var(--spec-1)", "var(--spec-3)", "var(--spec-5)"];
  return (
    <div ref={ref} className="relative aspect-square w-full max-w-[560px]" style={{ transform: `rotateX(${-t.y}deg) rotateY(${t.x}deg)`, transition: "transform .3s ease-out" }}>
      <svg viewBox="-220 -220 440 440" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="nuc"><stop offset="0" stopColor="var(--spec-2)" /><stop offset=".6" stopColor="var(--spec-1)" /><stop offset="1" stopColor="var(--spec-5)" /></radialGradient>
          <linearGradient id="spec" x1="0" x2="1"><stop offset="0" stopColor="var(--spec-1)" /><stop offset=".25" stopColor="var(--spec-2)" /><stop offset=".5" stopColor="var(--spec-3)" /><stop offset=".75" stopColor="var(--spec-4)" /><stop offset="1" stopColor="var(--spec-5)" /></linearGradient>
        </defs>
        <circle r="200" fill="none" stroke="var(--border)" strokeDasharray="2 8" className="spin-slow" />
        <circle r="150" fill="none" stroke="var(--border)" />
        {orbits.map((rot, i) => (
          <g key={rot} transform={`rotate(${rot})`}>
            <ellipse rx="190" ry="62" fill="none" stroke="url(#spec)" strokeWidth="2" opacity=".85" />
            <circle r="9" fill={colors[i]}>
              <animateMotion dur={`${3 + i}s`} repeatCount="indefinite" path="M190,0 A190,62 0 1,1 -190,0 A190,62 0 1,1 190,0" />
            </circle>
          </g>
        ))}
        <circle r="38" fill="url(#nuc)" opacity=".25" className="pulse-ring" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
        <g className="spin-mid">
          {[[-12, -8], [12, -6], [0, 12], [-6, 6], [8, 8], [2, -14]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="13" fill={i % 2 ? "var(--spec-1)" : "var(--spec-4)"} stroke="var(--background)" strokeWidth="2" />
          ))}
        </g>
      </svg>
      <div className="glass floaty absolute right-0 top-[14%] rounded-2xl px-4 py-3">
        <p className="font-mono text-[10px] tracking-[.2em] text-muted-foreground">WAVELENGTH</p>
        <p className="font-mono text-lg">380 – 750 nm</p>
      </div>
      <div className="glass floaty absolute bottom-[12%] left-0 rounded-2xl px-4 py-3" style={{ animationDelay: "-3s" }}>
        <p className="font-mono text-[10px] tracking-[.2em] text-muted-foreground">EDITION</p>
        <p className="font-mono text-lg">2026 · Live</p>
      </div>
    </div>
  );
}

function Helix() {
  const pts = Array.from({ length: 28 }, (_, i) => i);
  return (
    <svg viewBox="0 0 560 120" className="h-28 w-full">
      {pts.map((i) => {
        const x = i * 20 + 10;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1="60" y2="60" stroke="var(--border)" strokeWidth="2">
              <animate attributeName="y1" values="20;100;20" dur="3s" begin={`${-i * 0.15}s`} repeatCount="indefinite" />
              <animate attributeName="y2" values="100;20;100" dur="3s" begin={`${-i * 0.15}s`} repeatCount="indefinite" />
            </line>
            <circle cx={x} r="5" fill="var(--spec-4)"><animate attributeName="cy" values="20;100;20" dur="3s" begin={`${-i * 0.15}s`} repeatCount="indefinite" /></circle>
            <circle cx={x} r="5" fill="var(--spec-1)"><animate attributeName="cy" values="100;20;100" dur="3s" begin={`${-i * 0.15}s`} repeatCount="indefinite" /></circle>
          </g>
        );
      })}
    </svg>
  );
}

const subjects = [
  { n: "01", icon: Atom, t: "Physics", d: "Forces, light and motion — build, launch and measure in the Physics Lab.", c: "text-spec-5" },
  { n: "02", icon: FlaskConical, t: "Chemistry", d: "Reactions you can see, smell and hear in the Chemistry Challenge.", c: "text-spec-1" },
  { n: "03", icon: Dna, t: "Biology", d: "Cells, ecosystems and life under the lens in BioQuest.", c: "text-spec-3" },
  { n: "04", icon: Cpu, t: "Computer Science", d: "Logic, algorithms and speed in the Code Sprint.", c: "text-spec-4" },
];
function Index() {
  useReveal();
  const { data } = useSuspenseQuery(festivalQuery);
  return (
    <div className="min-h-screen overflow-x-hidden text-foreground">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-6 lg:grid-cols-2">
        <div>
          <p className="rise flex items-center gap-3 font-mono text-xs tracking-[.25em] text-muted-foreground"><span className="h-px w-10 bg-muted-foreground" />RAJAJI VIDYALAYA · SCIENCE FESTIVAL</p>
          <h1 className="rise mt-6 font-display text-5xl font-bold leading-[1] sm:text-7xl" style={{ animationDelay: ".1s" }}>
            <span className="text-spectrum">SPECTRUM</span><br />2026
          </h1>
          <p className="rise mt-3 font-serif text-4xl italic text-primary sm:text-5xl" style={{ animationDelay: ".2s" }}>Every colour of science.</p>
          <p className="rise mt-6 max-w-md text-lg text-muted-foreground" style={{ animationDelay: ".3s" }}>Four sciences, one festival. Experiment, compete and watch your team climb the live scoreboard.</p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: ".4s" }}>
            <Button asChild size="lg"><Link to="/events">EXPLORE EVENTS <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/leaderboard">LIVE SCORES</Link></Button>
          </div>
        </div>
        <div className="relative flex justify-center pb-20" style={{ perspective: 1000 }}><AtomScene /><div className="absolute bottom-0 right-0 w-[65%] max-w-[330px]"><CodeScene /></div></div>
      </section>
      <a href="#idea" className="mx-auto mb-10 flex w-fit flex-col items-center gap-2 font-mono text-xs tracking-[.3em] text-muted-foreground">SCROLL <ArrowDown className="h-4 w-4 animate-bounce" /></a>

      <div className="border-y border-border bg-card py-4">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-2xl font-semibold">
          {Array.from({ length: 2 }).flatMap((_, k) => ["Physics", "Chemistry", "Biology", "Code", "Experiment", "Discover", "Compete", "SPECTRUM 2026"].map((w, i) => (
            <span key={`${k}${i}`} className="flex items-center gap-12">{w}<Sparkles className="h-5 w-5 text-accent" /></span>
          )))}
        </div>
      </div>

      <section id="idea" className="mx-auto max-w-7xl px-6 py-28">
        <p className="reveal font-mono text-xs tracking-[.25em] text-muted-foreground">01 — THE IDEA</p>
        <h2 className="reveal mt-4 max-w-3xl font-display text-4xl font-bold sm:text-6xl">Every colour of science, <span className="font-serif font-normal italic text-primary">in one place.</span></h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {subjects.map(({ n, icon: I, t, d, c }, i) => (
            <div key={t} className="reveal glass group rounded-md p-7 transition hover:-translate-y-2" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between"><I className={`h-9 w-9 ${c} transition group-hover:rotate-12`} /><span className="font-mono text-sm text-muted-foreground">{n}</span></div>
              <h3 className="mt-10 font-display text-2xl font-bold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-y border-border px-6 py-5"><Helix /></section>

      <section id="events" className="mx-auto max-w-7xl px-6 py-28">
        <p className="reveal font-mono text-xs tracking-[.25em] text-muted-foreground">02 — EVENTS</p>
        <h2 className="reveal mt-4 font-display text-4xl font-bold sm:text-6xl">Four labs. <span className="font-serif font-normal italic text-primary">Endless questions.</span></h2>
        <div className="mt-12"><EventList data={data} preview /></div>
      </section>
      <section id="liveboard" className="mx-auto max-w-7xl px-6 pb-20">
        <p className="font-mono text-xs text-primary">03 — LIVE LEADERBOARD</p>
        <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Every discovery <span className="font-serif italic font-normal text-primary">counts.</span></h2>
        <div className="my-8 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-4">{[{label:"Participants",value:data.students.length},{label:"Tokens earned",value:data.students.reduce((sum,s)=>sum+s.earned,0)},{label:"Events",value:data.events.length},{label:"Redemptions",value:data.transactions.filter(t=>t.kind==='redeem'&&!t.reverted).length}].map(s=><div key={s.label}><p className="font-mono text-3xl text-primary">{s.value}</p><p className="mt-1 text-sm text-muted-foreground">{s.label}</p></div>)}</div>
        <Leaderboard data={data} preview />
        <h3 className="mt-12 mb-6 font-display text-2xl font-bold">Stall rewards</h3><StallRewards data={data}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20"><p className="font-mono text-xs text-primary">04 — FESTIVAL GALLERY</p><h2 className="mt-4 mb-10 font-display text-4xl font-bold">Discovery, <span className="font-serif italic font-normal text-primary">captured.</span></h2><GalleryGrid data={data} preview /></section>
      <section id="about" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="reveal relative overflow-hidden bg-foreground p-12 text-center text-background sm:p-20">
          <svg viewBox="0 0 800 200" className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-60" preserveAspectRatio="none">
            {["var(--spec-1)", "var(--spec-3)", "var(--spec-5)"].map((c, i) => (
              <path key={c} className="wave" d={`M0 100 Q 100 ${40 + i * 30} 200 100 T 400 100 T 600 100 T 800 100`} fill="none" stroke={c} strokeWidth="2" style={{ animationDuration: `${4 + i * 2}s` }} />
            ))}
          </svg>
          <h2 className="relative font-display text-4xl font-bold sm:text-6xl">Ready to split the light?</h2>
          <p className="relative mx-auto mt-4 max-w-lg opacity-70">Join us at Rajaji Vidyalaya Senior Secondary for SPECTRUM 2026.</p>
          <Button asChild className="relative mt-8" size="lg"><Link to="/events">SEE ALL EVENTS <ArrowRight /></Link></Button>
        </div>
      </section>

    </div>
  );
}
