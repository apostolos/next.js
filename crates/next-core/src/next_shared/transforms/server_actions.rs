use anyhow::Result;
use async_trait::async_trait;
use next_custom_transforms::transforms::server_actions::{server_actions, Config};
use serde::{Deserialize, Serialize};
use swc_core::{common::FileName, ecma::ast::Program};
use turbo_tasks::{ResolvedVc, TaskInput, Vc};
use turbopack::module_options::{ModuleRule, ModuleRuleEffect};
use turbopack_ecmascript::{
    CustomTransformer, EcmascriptInputTransform, TransformContext, TransformPlugin,
};

use super::module_rule_match_js_no_url;
use crate::next_config::CacheKinds;

#[derive(Debug, TaskInput, Hash, PartialEq, Eq, Clone, Serialize, Deserialize)]
pub enum ActionsTransform {
    Client,
    Server,
}

/// Returns a rule which applies the Next.js Server Actions transform.
pub async fn get_server_actions_transform_rule(
    transform: ActionsTransform,
    enable_mdx_rs: bool,
    dynamic_io_enabled: bool,
    cache_kinds: ResolvedVc<CacheKinds>,
) -> Result<ModuleRule> {
    let transformer = EcmascriptInputTransform::Plugin(
        NextServerActions::new(transform, dynamic_io_enabled, *cache_kinds)
            .to_resolved()
            .await?,
    );
    Ok(ModuleRule::new(
        module_rule_match_js_no_url(enable_mdx_rs),
        vec![ModuleRuleEffect::ExtendEcmascriptTransforms {
            prepend: ResolvedVc::cell(vec![]),
            append: ResolvedVc::cell(vec![transformer]),
        }],
    ))
}

#[derive(Debug)]
struct NextServerActions {
    transform: ActionsTransform,
    dynamic_io_enabled: bool,
    cache_kinds: ResolvedVc<CacheKinds>,
}

#[turbo_tasks::value_impl]
impl NextServerActions {
    #[turbo_tasks::function]
    fn new(
        transform: ActionsTransform,
        dynamic_io_enabled: bool,
        cache_kinds: ResolvedVc<CacheKinds>,
    ) -> Vc<TransformPlugin> {
        Vc::cell(Box::new(Self {
            transform,
            dynamic_io_enabled,
            cache_kinds,
        }) as _)
    }
}

#[async_trait]
impl CustomTransformer for NextServerActions {
    #[tracing::instrument(level = tracing::Level::TRACE, name = "server_actions", skip_all)]
    async fn transform(&self, program: &mut Program, ctx: &TransformContext<'_>) -> Result<()> {
        let actions = server_actions(
            &FileName::Real(ctx.file_path_str.into()),
            Config {
                is_react_server_layer: matches!(self.transform, ActionsTransform::Server),
                dynamic_io_enabled: self.dynamic_io_enabled,
                hash_salt: "".into(),
                cache_kinds: self.cache_kinds.await?.clone_value(),
            },
            ctx.comments.clone(),
        );

        program.mutate(actions);
        Ok(())
    }
}
