import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@rallly/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@rallly/ui/form";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LanguageSelect } from "@/components/poll/language-selector";
import { Trans } from "@/components/trans";
import { usePreferences } from "@/contexts/preferences";
import { useTranslation } from "@/i18n/client";

const formSchema = z.object({
  language: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export const LanguagePreference = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const form = useForm<FormData>({
    defaultValues: {
      language: i18n.language,
    },
    resolver: zodResolver(formSchema),
  });
  const { updatePreferences } = usePreferences();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          await updatePreferences({ locale: data.language });
          router.refresh();
        })}
      >
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans i18nKey="common_language" />
              </FormLabel>
              <LanguageSelect value={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant="primary"
            disabled={!form.formState.isDirty}
            loading={form.formState.isSubmitting}
            type="submit"
          >
            <Trans i18nKey="save" />
          </Button>
          <Button asChild variant="ghost">
            <Link
              target="_blank"
              href="https://support.rallly.co/contribute/translations"
            >
              <Trans i18nKey="becomeATranslator" defaults="Help translate" />
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
