"use client";

import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";
import { useWinampStore } from "@/store/winampStore";

interface Track { name: string; url: string; }

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read skin image."));
    reader.readAsDataURL(file);
  });
}

export function WinampWidget() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skinInputRef = useRef<HTMLInputElement>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [skinMessage, setSkinMessage] = useState("SKINS: .WSZ / .ZIP / IMAGE");
  const skinName = useWinampStore((state) => state.skinName);
  const skinDataUrl = useWinampStore((state) => state.skinDataUrl);
  const setSkin = useWinampStore((state) => state.setSkin);
  const clearSkin = useWinampStore((state) => state.clearSkin);
  const track = tracks[trackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => () => tracks.forEach((item) => URL.revokeObjectURL(item.url)), [tracks]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function selectTrack(index: number) {
    setTrackIndex(index);
    setProgress(0);
    setElapsed(0);
    setPlaying(false);
  }

  function onTracksSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const nextTracks = Array.from(event.target.files ?? []).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    if (nextTracks.length) { setTracks(nextTracks); setTrackIndex(0); setPlaying(false); }
    event.target.value = "";
  }

  async function onSkinSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      let image: Blob = file;
      let name = file.name;
      if (/\.(wsz|zip)$/i.test(file.name)) {
        const zip = await JSZip.loadAsync(file);
        const candidates = zip.file(/(^|\/)(main|skin)\.(bmp|png|jpg|jpeg)$/i);
        const fallback = zip.file(/\.(bmp|png|jpg|jpeg)$/i);
        const asset = candidates[0] ?? fallback[0];
        if (!asset) throw new Error("No skin image found in archive.");
        image = await asset.async("blob");
        name = file.name;
      }
      if (!image.type.startsWith("image/") && !/\.(bmp|png|jpg|jpeg)$/i.test(name)) throw new Error("Choose a .wsz/.zip archive or an image skin.");
      setSkin(name.replace(/\.(wsz|zip|bmp|png|jpg|jpeg)$/i, ""), await fileToDataUrl(image));
      setSkinMessage("SKIN LOADED / LOCAL");
    } catch (error) {
      setSkinMessage(error instanceof Error ? error.message : "Could not load skin.");
    }
  }

  function seek(event: React.ChangeEvent<HTMLInputElement>) {
    const next = Number(event.target.value);
    if (audioRef.current && duration) audioRef.current.currentTime = next;
    setProgress(duration ? (next / duration) * 100 : 0);
  }

  return (
    <div className="winamp-widget" style={skinDataUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,.18), rgba(0,0,0,.18)), url(${skinDataUrl})` } : undefined}>
      <div className="winamp-head"><span>WINAMP</span><span className="winamp-skin-name">{skinName}</span></div>
      <div className="winamp-display"><span className="winamp-led">{playing ? "▶" : "■"}</span><strong>{track ? track.name : "NO TRACK LOADED"}</strong><small>{elapsed.toFixed(0).padStart(2, "0")} / {duration.toFixed(0).padStart(2, "0")} SEC</small></div>
      <div className="winamp-controls"><button type="button" onClick={() => selectTrack(Math.max(0, trackIndex - 1))}>◀◀</button><button type="button" onClick={() => void togglePlayback()} disabled={!track}>{playing ? "Ⅱ" : "▶"}</button><button type="button" onClick={() => selectTrack(Math.min(Math.max(0, tracks.length - 1), trackIndex + 1))}>▶▶</button><button type="button" onClick={() => { audioRef.current?.pause(); setPlaying(false); }}>■</button></div>
      <label className="winamp-slider">SEEK<input type="range" min="0" max={duration || 1} value={duration ? (progress / 100) * duration : 0} onChange={seek} /></label>
      <label className="winamp-slider">VOL<input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
      <div className="winamp-actions"><button type="button" onClick={() => fileInputRef.current?.click()}>ADD MUSIC</button><button type="button" onClick={() => skinInputRef.current?.click()}>LOAD SKIN</button>{skinDataUrl && <button type="button" onClick={clearSkin}>DEFAULT</button>}</div>
      <div className="winamp-status">{skinMessage}</div>
      {tracks.length > 0 && <div className="winamp-playlist">{tracks.map((item, index) => <button type="button" className={index === trackIndex ? "is-current" : ""} key={`${item.url}-${item.name}`} onClick={() => selectTrack(index)}>{String(index + 1).padStart(2, "0")} {item.name}</button>)}</div>}
      <input ref={fileInputRef} type="file" accept="audio/*" multiple hidden onChange={onTracksSelected} />
      <input ref={skinInputRef} type="file" accept=".wsz,.zip,.bmp,.png,.jpg,.jpeg,image/*" hidden onChange={(event) => void onSkinSelected(event)} />
      <audio ref={audioRef} src={track?.url} onTimeUpdate={(event) => { const audio = event.currentTarget; setElapsed(audio.currentTime); setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0); }} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onEnded={() => { if (trackIndex < tracks.length - 1) selectTrack(trackIndex + 1); else setPlaying(false); }} />
    </div>
  );
}
