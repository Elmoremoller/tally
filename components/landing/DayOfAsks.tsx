import type { CSSProperties } from "react";
import { Bell, Calendar, Chat, Mail } from "@/components/icons";
import { problem } from "@/lib/landing";
import { Arrive } from "./Arrive";

// Her day as it lands on her phone: the time it is now, late, and the asks that came in since morning, each
// with the kind of app it came from. They arrive one by one as the section comes into view, the overdue
// reminder last, after a beat.

const apps = { chat: Chat, mail: Mail, calendar: Calendar, reminder: Bell };

export function DayOfAsks() {
  return (
    <div className="day">
      <p className="day-clock">
        <span className="day-name">{problem.clock.day}</span>
        <span className="day-time">{problem.clock.time}</span>
      </p>
      <Arrive className="asks">
        {problem.asks.map((ask, i) => {
          const { app, from, time, text } = ask;
          const Icon = apps[app];
          const onPhone = !("phone" in ask);
          // Where it falls among the asks a phone shows, so they still arrive one after another without a gap.
          const phoneIndex = problem.asks.slice(0, i).filter((other) => !("phone" in other)).length;
          return (
            <li
              key={from}
              className="ask"
              data-app={app}
              data-phone={onPhone ? undefined : "off"}
              style={{ "--i": i, "--pi": phoneIndex } as CSSProperties}
            >
              <span className="ask-app" aria-hidden="true">
                <Icon />
              </span>
              <span className="ask-body">
                <span className="ask-head">
                  <span className="ask-from">{from}</span>
                  <span className="ask-time">{time}</span>
                </span>
                <span className="ask-text">{text}</span>
              </span>
            </li>
          );
        })}
      </Arrive>
    </div>
  );
}
