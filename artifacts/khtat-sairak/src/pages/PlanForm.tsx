import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CreatePlanRequestStatus,
  CreatePlanRequestType,
  useCreatePlan,
  useGetPlan,
  useUpdatePlan,
} from '@workspace/api-client-react';
import { ArrowRight, Eye, EyeOff, Lock, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLocation, useParams } from 'wouter';

export default function PlanForm() {
  const params = useParams<{ id?: string }>();
  const planId = params?.id ?? '';
  const isEdit = !!planId;
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'رحلة' as CreatePlanRequestType,
    status: 'خاصة' as CreatePlanRequestStatus,
    password: '',
    notes: '',
    scheduledAt: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { data: planToEdit, isLoading: isFetching } = useGetPlan(planId);

  useEffect(() => {
    if (!isEdit || !planToEdit) return;

    setFormData({
      title: planToEdit.title,
      description: planToEdit.description || '',
      type: planToEdit.type as CreatePlanRequestType,
      status: planToEdit.status as CreatePlanRequestStatus,
      password: '',
      notes: planToEdit.notes || '',
      scheduledAt: planToEdit.scheduledAt ? new Date(planToEdit.scheduledAt).toISOString().slice(0, 16) : '',
    });
  }, [isEdit, planToEdit]);

  const createMutation = useCreatePlan({
    mutation: {
      onSuccess: (data) => {
        toast.success("تم إنشاء الخطة بنجاح!");
        setLocation(`/plans/${data.id}`);
      },
      onError: () => toast.error("حدث خطأ أثناء الإنشاء"),
    },
  });

  const updateMutation = useUpdatePlan({
    mutation: {
      onSuccess: (data) => {
        toast.success("تم تحديث الخطة بنجاح!");
        setLocation(`/plans/${data.id}`);
      },
      onError: () => toast.error("حدث خطأ أثناء التحديث"),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("عنوان الخطة مطلوب");
      return;
    }

    const payload = {
      ...formData,
      password: formData.password || null,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null,
    };

    if (isEdit) {
      updateMutation.mutate({ id: planId, data: payload });
      return;
    }

    createMutation.mutate({ data: payload });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="mb-8">
          <ArrowRight className="ml-2 w-5 h-5" /> عودة للوحة التحكم
        </Button>

        <div className="glass-panel p-8 md:p-10 rounded-3xl">
          <h1 className="text-3xl font-bold mb-8">{isEdit ? 'تعديل الخطة' : 'إنشاء خطة جديدة'}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">عنوان الخطة *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: رحلة نهاية الأسبوع للبر"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">وصف قصير</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="تفاصيل سريعة عن وجهتك..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">نوع الخطة</label>
                <select
                  className="flex h-12 w-full rounded-xl border border-border bg-background/50 px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CreatePlanRequestType })}
                >
                  <option value="رحلة">رحلة</option>
                  <option value="سفر">سفر</option>
                  <option value="طلعة">طلعة</option>
                  <option value="مشوار">مشوار</option>
                  <option value="مخصص">مخصص</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">حالة المشاركة</label>
                <select
                  className="flex h-12 w-full rounded-xl border border-border bg-background/50 px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CreatePlanRequestStatus })}
                >
                  <option value="خاصة">خاصة (لي فقط)</option>
                  <option value="مشتركة">مشتركة (برابط)</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">موعد الرحلة</label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">ملاحظات</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" /> كلمة مرور للخطة
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="اتركها فارغة إذا لا تريد حماية"
                    className="pl-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="submit" size="lg" className="flex-1" disabled={isPending}>
                <Save className="ml-2 w-5 h-5" />
                {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء الخطة'}
              </Button>
              <Button type="button" size="lg" variant="outline" onClick={() => setLocation('/dashboard')}>
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}