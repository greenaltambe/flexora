import { useState } from "react";
import api from "../config/axios";
import {
  Activity,
  Dumbbell,
  Zap,
  Weight,
  Target,
  ChevronRight,
  ChevronLeft,
  SkipForward,
} from "lucide-react";

/**
 * Notes:
 * - I replaced unknown icons like `Run` and `Treadmill` with `Activity`.
 * - `Dumbbell` is used for both dumbbell/barbell entries (Lucide doesn't always have a distinct 'barbell').
 * - `Weight` works nicely as a generic kettlebell/weight symbol.
 * - If you want a very specific icon later (e.g. sneaker/kettlebell), check lucide.dev or @lucide/lab.
 */

const equipmentOptions = [
  { key: "bodyweight", label: "Bodyweight", icon: Activity },
  { key: "dumbbell", label: "Dumbbell", icon: Dumbbell },
  { key: "barbell", label: "Barbell", icon: Dumbbell }, // lucide has dumbbell; barbell is less common
  { key: "treadmill", label: "Treadmill", icon: Activity }, // treadmill visual -> activity/running substitute
  { key: "resistance_band", label: "Resistance band", icon: Zap },
  { key: "kettlebell", label: "Kettlebell", icon: Weight },
];

export default function OnboardingForm({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    goals: [],
    experience_level: "beginner",
    equipment: ["bodyweight"],
    days_per_week: 3,
    session_length_minutes: 45,
    injuries: [],
    baseline_metrics: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleEquipment = (key) => {
    setForm((prev) => {
      const has = prev.equipment.includes(key);
      const next = has ? prev.equipment.filter((e) => e !== key) : [...prev.equipment, key];
      return { ...prev, equipment: next };
    });
  };

  const handleSkipForLater = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/profile/onboard", { profile: form, skipBaseline: true });
      setLoading(false);
      onComplete && onComplete();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message);
    }
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/profile/onboard", { profile: form });
      setLoading(false);
      onComplete && onComplete();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">What are your fitness goals?</h2>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium mb-3">Select your goals</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  "run-performance",
                  "endurance",
                  "strength",
                  "hypertrophy",
                  "fat-loss",
                  "mobility",
                ].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setForm((prev) => {
                        const has = prev.goals.includes(g);
                        return {
                          ...prev,
                          goals: has ? prev.goals.filter((x) => x !== g) : [...prev.goals, g],
                        };
                      });
                    }}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      form.goals.includes(g)
                        ? "bg-primary text-primary-content border-primary"
                        : "bg-base-100 hover:bg-base-200"
                    }`}
                  >
                    {g.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience + Days */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <select
                  value={form.experience_level}
                  onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Days per week</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={form.days_per_week}
                  onChange={(e) => setForm({ ...form, days_per_week: Number(e.target.value) })}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Session length */}
            <div>
              <label className="block text-sm font-medium mb-2">Session length (minutes)</label>
              <input
                type="number"
                min="10"
                max="300"
                value={form.session_length_minutes}
                onChange={(e) =>
                  setForm({ ...form, session_length_minutes: Number(e.target.value) })
                }
                className="input input-bordered w-32"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">What equipment do you have?</h2>

            <div>
              <label className="block text-sm font-medium mb-3">Select your available equipment</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {equipmentOptions.map((eq) => {
                  const active = form.equipment.includes(eq.key);
                  const IconComponent = eq.icon;
                  return (
                    <button
                      key={eq.key}
                      type="button"
                      onClick={() => toggleEquipment(eq.key)}
                      className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                        active ? "bg-primary text-primary-content border-primary" : "bg-base-100 hover:bg-base-200"
                      }`}
                    >
                      <IconComponent className="w-8 h-8" />
                      <span className="text-sm font-medium">{eq.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Baseline Metrics (Optional)</h2>
            <p className="text-base-content/70 mb-4">You can add your baseline metrics now or update them later.</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={form.baseline_metrics.age || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      baseline_metrics: {
                        ...form.baseline_metrics,
                        age: e.target.value ? Number(e.target.value) : null,
                      },
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sex</label>
                <select
                  value={form.baseline_metrics.sex || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      baseline_metrics: {
                        ...form.baseline_metrics,
                        sex: e.target.value || null,
                      },
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Not specified</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={form.baseline_metrics.height_cm || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      baseline_metrics: {
                        ...form.baseline_metrics,
                        height_cm: e.target.value ? Number(e.target.value) : null,
                      },
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={form.baseline_metrics.weight_kg || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      baseline_metrics: {
                        ...form.baseline_metrics,
                        weight_kg: e.target.value ? Number(e.target.value) : null,
                      },
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  s === step ? "bg-primary text-primary-content" : s < step ? "bg-success text-success-content" : "bg-base-300 text-base-content"
                }`}
              >
                {s === step ? <Target className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? "bg-success" : "bg-base-300"}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span className={step === 1 ? "font-semibold" : ""}>Goals</span>
          <span className={step === 2 ? "font-semibold" : ""}>Equipment</span>
          <span className={step === 3 ? "font-semibold" : ""}>Baseline</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">{renderStepContent()}</div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {step > 1 && (
            <button onClick={prevStep} className="btn btn-outline" disabled={loading}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {step === 3 && (
            <button onClick={handleSkipForLater} className="btn btn-ghost" disabled={loading}>
              <SkipForward className="w-4 h-4" />
              I'll add this later
            </button>
          )}
          {step < 3 ? (
            <button onClick={nextStep} className="btn btn-primary" disabled={loading}>
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={submit} className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Finish Onboarding"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error mt-4">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
